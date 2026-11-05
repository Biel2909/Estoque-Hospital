# Controle de estoque hospitalar

Aplicação web em português para cadastrar medicamentos e materiais hospitalares, acompanhar o estoque e consultar seu histórico de movimentações. A interface identifica itens com estoque baixo ou próximos do vencimento e oferece relatórios para acompanhamento.

## Funcionalidades

- **Painel geral:** total de medicamentos e unidades, itens no limite ou abaixo do estoque mínimo, vencimentos próximos, avisos e movimentações recentes.
- **Medicamentos:** cadastro e edição de nome, princípio ativo, apresentação, categoria, unidade, quantidade, estoque mínimo, lote, validade e fornecedor.
- **Busca e filtros:** pesquisa por medicamento, princípio ativo, apresentação, lote ou fornecedor; filtros por categoria e situação do estoque.
- **Movimentações:** registro de entradas, saídas e ajustes, com responsável e observação. Saídas maiores que o saldo disponível não são aceitas.
- **Relatórios:** resumo por categoria, alertas e listagem completa do estoque. É possível imprimir o relatório ou exportar o inventário em CSV.
- **Interface responsiva:** navegação adaptada a telas menores.

### Situações do estoque

O sistema apresenta os itens como sem estoque, vencidos, próximos do vencimento, com estoque baixo ou adequados. O estoque baixo é identificado quando a quantidade é menor ou igual ao mínimo informado; vencimentos próximos consideram os próximos 90 dias.

## Tecnologias

- PHP 8.3 para servir a página e incluir os componentes PHP.
- HTML, CSS e JavaScript sem framework ou dependências de pacotes.
- `localStorage` do navegador para persistir os dados da aplicação.
- Docker Compose com PHP-FPM e Nginx para execução em contêineres.
- `estoque_hospital.sql` com uma proposta de esquema SQL para medicamentos e movimentações.

## Executar com Docker

Pré-requisitos: Docker instalado e em execução, com suporte ao comando `docker compose`.

Na pasta do projeto, execute:

```powershell
docker compose up -d
```

Abra [http://localhost:8080](http://localhost:8080) no navegador. O Nginx atende a aplicação na porta `8080` e encaminha arquivos PHP ao serviço PHP-FPM.

Para encerrar os contêineres:

```powershell
docker compose down
```

## Executar sem Docker

Com PHP instalado, abra um terminal na pasta do projeto e inicie o servidor embutido:

```powershell
php -S 127.0.0.1:8000
```

Acesse [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Como os dados são armazenados

Os cadastros e as movimentações são salvos automaticamente no armazenamento local do navegador, usando a chave `medstock-hospital-v1`. Isso significa que:

- Os dados ficam disponíveis apenas no mesmo navegador, perfil e endereço de acesso.
- Outros computadores ou navegadores não compartilham os dados.
- Limpar os dados do site no navegador pode apagar os cadastros e o histórico.
- O CSV exportado contém os dados do inventário, mas não é uma cópia de segurança completa do histórico de movimentações.

**Atenção:** a aplicação atualmente não envia dados para um servidor nem usa um banco de dados. O arquivo `estoque_hospital.sql` documenta um esquema SQL com tabelas, índices, gatilhos e visões para medicamentos e movimentações, mas ainda não está conectado ao PHP ou ao JavaScript da aplicação.

## Estrutura do projeto

| Arquivo | Responsabilidade |
| --- | --- |
| `index.php` | Página de entrada; inclui o cabeçalho, a navegação e os modais. |
| `header.php` | Metadados HTML, título da página e referências ao CSS e JavaScript. |
| `sidebar.php` | Navegação lateral e conteúdo das páginas de painel, estoque, movimentações e relatórios. |
| `modal.php` | Formulários para cadastro/edição de medicamentos e registro de movimentações. |
| `app.js` | Lógica da interface, validação, cálculos, renderização e persistência no navegador. |
| `styles.css` | Estilos, estados visuais, responsividade e ajustes de impressão. |
| `docker-compose.yml` | Serviços PHP-FPM e Nginx e configuração da porta local. |
| `default.conf` | Configuração do Nginx para encaminhar requisições PHP ao PHP-FPM. |
| `estoque_hospital.sql` | Esquema SQL proposto para persistência relacional; não utilizado pela aplicação atual. |

## Observações

- A quantidade existente de um medicamento é alterada por uma movimentação; ao editar o cadastro, a quantidade fica bloqueada.
- O sistema impede o cadastro de medicamentos com o mesmo nome e apresentação.
- A exclusão de um medicamento pede confirmação. As movimentações já registradas são mantidas no histórico local.
- A exportação CSV é gerada no navegador, em formato separado por ponto e vírgula e com codificação adequada para acentos.
