<div class="modal-backdrop" id="medicine-modal" role="dialog" aria-modal="true" aria-labelledby="medicine-modal-title">
    <div class="modal">
      <div class="modal-head"><div><h2 id="medicine-modal-title">Cadastrar medicamento</h2><p>Preencha os dados do item para controlar seu estoque.</p></div><button class="modal-close" data-close="medicine-modal" aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m18 6-12 12M6 6l12 12"/></svg></button></div>
      <form id="medicine-form">
        <div class="modal-body">
          <input type="hidden" id="medicine-id">
          <div class="form-grid">
            <div class="field full"><label for="medicine-name">Nome do medicamento <span class="required">*</span></label><input id="medicine-name" name="name" required maxlength="100" placeholder="Ex.: Paracetamol"></div>
            <div class="field"><label for="medicine-active">Princípio ativo</label><input id="medicine-active" name="activeIngredient" maxlength="100" placeholder="Ex.: Paracetamol"></div>
            <div class="field"><label for="medicine-presentation">Apresentação <span class="required">*</span></label><input id="medicine-presentation" name="presentation" required maxlength="80" placeholder="Ex.: 500 mg — comprimido"></div>
            <div class="field"><label for="medicine-category">Categoria <span class="required">*</span></label><select id="medicine-category" name="category" required><option value="">Selecione</option><option>Analgesia</option><option>Antibiótico</option><option>Anti-inflamatório</option><option>Cardiovascular</option><option>Dermatologia</option><option>Gastroenterologia</option><option>Material hospitalar</option><option>Outros</option><option>Respiratório</option></select></div>
            <div class="field"><label for="medicine-unit">Unidade de medida <span class="required">*</span></label><select id="medicine-unit" name="unit" required><option value="unidades">Unidades</option><option value="caixas">Caixas</option><option value="frascos">Frascos</option><option value="ampolas">Ampolas</option><option value="cartelas">Cartelas</option><option value="pacotes">Pacotes</option><option value="pares">Pares</option><option value="litros">Litros</option><option value="mL">mL</option><option value="g">g</option><option value="kg">kg</option></select></div>
            <div class="field"><label for="medicine-quantity">Quantidade inicial <span class="required">*</span></label><input id="medicine-quantity" name="quantity" type="number" min="0" step="1" required value="0"></div>
            <div class="field"><label for="medicine-minimum">Estoque mínimo <span class="required">*</span></label><input id="medicine-minimum" name="minimum" type="number" min="0" step="1" required value="10"></div>
            <div class="field"><label for="medicine-lot">Número do lote</label><input id="medicine-lot" name="lot" maxlength="60" placeholder="Ex.: LT-2026-001"></div>
            <div class="field"><label for="medicine-expiry">Data de validade</label><input id="medicine-expiry" name="expiry" type="date"></div>
            <div class="field full"><label for="medicine-supplier">Fornecedor</label><input id="medicine-supplier" name="supplier" maxlength="100" placeholder="Nome do fornecedor"></div>
          </div>
        </div>
        <div class="modal-footer"><button type="button" class="button button-secondary" data-close="medicine-modal">Cancelar</button><button type="submit" class="button button-primary">Salvar medicamento</button></div>
      </form>
    </div>
  </div>

  <div class="modal-backdrop" id="movement-modal" role="dialog" aria-modal="true" aria-labelledby="movement-modal-title">
    <div class="modal">
      <div class="modal-head"><div><h2 id="movement-modal-title">Registrar movimentação</h2><p>Atualize a quantidade em estoque e mantenha o histórico.</p></div><button class="modal-close" data-close="movement-modal" aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m18 6-12 12M6 6l12 12"/></svg></button></div>
      <form id="movement-form">
        <div class="modal-body">
          <div class="form-grid">
            <div class="field full"><label for="movement-medicine">Medicamento <span class="required">*</span></label><select id="movement-medicine" name="medicineId" required></select></div>
            <div class="field"><label for="movement-type">Tipo <span class="required">*</span></label><select id="movement-type" name="type" required><option value="Entrada">Entrada</option><option value="Saída">Saída</option><option value="Ajuste">Ajuste de estoque</option></select></div>
            <div class="field"><label for="movement-quantity">Quantidade <span class="required">*</span></label><input id="movement-quantity" name="quantity" type="number" min="1" step="1" required placeholder="0"><span class="field-hint" id="movement-quantity-hint">Informe uma quantidade maior que zero.</span></div>
            <div class="field full"><label for="movement-responsible">Responsável</label><input id="movement-responsible" name="responsible" maxlength="80" placeholder="Nome do responsável"></div>
            <div class="field full"><label for="movement-notes">Observação</label><textarea id="movement-notes" name="notes" maxlength="300" placeholder="Motivo da movimentação, setor solicitante, observações..."></textarea></div>
          </div>
        </div>
        <div class="modal-footer"><button type="button" class="button button-secondary" data-close="movement-modal">Cancelar</button><button type="submit" class="button button-primary">Confirmar movimentação</button></div>
      </form>
    </div>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
