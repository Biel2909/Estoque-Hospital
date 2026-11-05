PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS medicamentos (
    id TEXT PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL CHECK (length(trim(nome)) > 0),
    principio_ativo TEXT NOT NULL DEFAULT '',
    apresentacao TEXT NOT NULL CHECK (length(trim(apresentacao)) > 0),
    categoria TEXT NOT NULL CHECK (
        categoria IN (
            'Analgesia',
            'Antibiótico',
            'Anti-inflamatório',
            'Cardiovascular',
            'Dermatologia',
            'Gastroenterologia',
            'Material hospitalar',
            'Outros',
            'Respiratório'
        )
    ),
    unidade TEXT NOT NULL DEFAULT 'unidades' CHECK (
        unidade IN (
            'unidades', 'caixas', 'frascos', 'ampolas', 'cartelas',
            'pacotes', 'pares', 'litros', 'mL', 'g', 'kg'
        )
    ),
    quantidade INTEGER NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
    estoque_minimo INTEGER NOT NULL DEFAULT 10 CHECK (estoque_minimo >= 0),
    lote TEXT NOT NULL DEFAULT '',
    validade TEXT CHECK (
        validade IS NULL OR (
            length(validade) = 10
            AND validade GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
            AND date(validade) IS NOT NULL
        )
    ),
    fornecedor TEXT NOT NULL DEFAULT '',
    criado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    atualizado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_medicamentos_nome_apresentacao
    ON medicamentos (lower(trim(nome)), lower(trim(apresentacao)));

CREATE INDEX IF NOT EXISTS ix_medicamentos_categoria
    ON medicamentos (categoria);

CREATE INDEX IF NOT EXISTS ix_medicamentos_validade
    ON medicamentos (validade);

CREATE TABLE IF NOT EXISTS movimentacoes (
    id TEXT PRIMARY KEY NOT NULL,
    medicamento_id TEXT,
    medicamento_nome TEXT NOT NULL CHECK (length(trim(medicamento_nome)) > 0),
    tipo TEXT NOT NULL CHECK (tipo IN ('Entrada', 'Saída', 'Ajuste')),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    saldo_apos INTEGER NOT NULL DEFAULT 0 CHECK (saldo_apos >= 0),
    responsavel TEXT NOT NULL DEFAULT '',
    observacao TEXT NOT NULL DEFAULT '',
    data_hora TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (medicamento_id)
        REFERENCES medicamentos (id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS ix_movimentacoes_medicamento_data
    ON movimentacoes (medicamento_id, data_hora DESC);

CREATE INDEX IF NOT EXISTS ix_movimentacoes_data
    ON movimentacoes (data_hora DESC);

CREATE TRIGGER IF NOT EXISTS trg_movimentacoes_validar_saida
BEFORE INSERT ON movimentacoes
WHEN NEW.medicamento_id IS NOT NULL
     AND NEW.tipo = 'Saída'
     AND NEW.quantidade > (
         SELECT quantidade
         FROM medicamentos
         WHERE id = NEW.medicamento_id
     )
BEGIN
    SELECT RAISE(ABORT, 'Estoque insuficiente para registrar esta saída.');
END;

CREATE TRIGGER IF NOT EXISTS trg_movimentacoes_atualizar_estoque
AFTER INSERT ON movimentacoes
WHEN NEW.medicamento_id IS NOT NULL
BEGIN
    UPDATE medicamentos
    SET quantidade = CASE NEW.tipo
            WHEN 'Entrada' THEN quantidade + NEW.quantidade
            WHEN 'Saída' THEN quantidade - NEW.quantidade
            WHEN 'Ajuste' THEN NEW.quantidade
        END,
        atualizado_em = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = NEW.medicamento_id;

    UPDATE movimentacoes
    SET saldo_apos = (
        SELECT quantidade
        FROM medicamentos
        WHERE id = NEW.medicamento_id
    ),
    medicamento_nome = COALESCE(
        (SELECT nome FROM medicamentos WHERE id = NEW.medicamento_id),
        NEW.medicamento_nome
    )
    WHERE id = NEW.id;
END;

CREATE VIEW IF NOT EXISTS vw_estoque_medicamentos AS
SELECT
    m.*,
    CASE
        WHEN m.quantidade = 0 THEN 'Sem estoque'
        WHEN m.validade IS NOT NULL AND date(m.validade) < date('now') THEN 'Vencido'
        WHEN m.validade IS NOT NULL
             AND julianday(m.validade) - julianday(date('now')) <= 90
            THEN 'Vence em breve'
        WHEN m.quantidade <= m.estoque_minimo THEN 'Estoque baixo'
        ELSE 'Adequado'
    END AS status_estoque
FROM medicamentos AS m;

CREATE VIEW IF NOT EXISTS vw_resumo_estoque AS
SELECT
    COUNT(*) AS medicamentos_cadastrados,
    COALESCE(SUM(quantidade), 0) AS unidades_em_estoque,
    COALESCE(SUM(CASE WHEN quantidade <= estoque_minimo THEN 1 ELSE 0 END), 0)
        AS medicamentos_com_estoque_baixo,
    COALESCE(SUM(
        CASE
            WHEN validade IS NOT NULL
                 AND julianday(validade) - julianday(date('now')) BETWEEN 0 AND 90
                THEN 1
            ELSE 0
        END
    ), 0) AS medicamentos_proximos_do_vencimento
FROM medicamentos;

CREATE VIEW IF NOT EXISTS vw_resumo_por_categoria AS
SELECT
    categoria,
    COUNT(*) AS medicamentos_cadastrados,
    COALESCE(SUM(quantidade), 0) AS unidades_em_estoque
FROM medicamentos
GROUP BY categoria;

CREATE VIEW IF NOT EXISTS vw_historico_movimentacoes AS
SELECT
    id,
    medicamento_id,
    medicamento_nome,
    tipo,
    quantidade,
    saldo_apos,
    responsavel,
    observacao,
    data_hora
FROM movimentacoes;
