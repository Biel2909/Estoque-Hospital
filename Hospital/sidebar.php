  <div class="app">
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></div>
        <div class="brand-name">Hospital e Maternidade<br><span>Christovão da Gama</span></div>
      </div>
      <div class="nav-label">Menu principal</div>
      <nav class="nav" aria-label="Menu principal">
        <button class="nav-button active" data-page="dashboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></svg><span>Painel geral</span>
        </button>
        <button class="nav-button" data-page="inventory">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg><span>Medicamentos</span><span class="nav-count" id="medicine-count">0</span>
        </button>
        <button class="nav-button" data-page="movements">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h13l-3-3M20 7l-3 3"/><path d="M17 17H4l3 3m-3-3 3-3"/></svg><span>Movimentações</span>
        </button>
        <button class="nav-button" data-page="reports">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5m0 14h17"/><path d="m7 15 4-5 3 2 5-7"/></svg><span>Relatórios</span>
        </button>
      </nav>
      <div class="sidebar-bottom">
        <div class="storage-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 3v4h8V3M8 17h8"/></svg>
          <span>Seus dados ficam salvos neste navegador.</span>
        </div>
        <div class="sidebar-footer">Hospital e Maternidade Christovão da Gama · Controle de estoque</div>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-menu" id="mobile-menu" aria-label="Abrir menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
          <div class="breadcrumb">Estoque <span aria-hidden="true"> / </span> <strong id="breadcrumb-current">Painel geral</strong></div>
        </div>
        <div class="topbar-right"><span class="today" id="today"></span><div class="avatar" aria-label="Administração">AD</div></div>
      </header>

      <div class="content">
        <section class="page active" id="page-dashboard">
          <div class="page-heading">
            <div><div class="eyebrow">Visão geral</div><h1>Painel de estoque</h1><p class="subtitle">Acompanhe seus medicamentos e o que precisa de atenção.</p></div>
            <button class="button button-primary" data-action="add-medicine">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><span class="button-label">Cadastrar medicamento</span>
            </button>
          </div>
          <div class="stats">
            <article class="stat-card"><div class="stat-top"><span class="stat-label">Medicamentos cadastrados</span><span class="stat-icon teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg></span></div><div class="stat-value" id="stat-medicines">0</div><div class="stat-foot">Itens diferentes no estoque</div></article>
            <article class="stat-card"><div class="stat-top"><span class="stat-label">Unidades em estoque</span><span class="stat-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></span></div><div class="stat-value" id="stat-units">0</div><div class="stat-foot">Quantidade total disponível</div></article>
            <article class="stat-card"><div class="stat-top"><span class="stat-label">Estoque baixo</span><span class="stat-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/></svg></span></div><div class="stat-value" id="stat-low">0</div><div class="stat-foot">No limite ou abaixo do mínimo</div></article>
            <article class="stat-card"><div class="stat-top"><span class="stat-label">Próximos do vencimento</span><span class="stat-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-9 3v3m-1.5-1.5h3"/></svg></span></div><div class="stat-value" id="stat-expiring">0</div><div class="stat-foot">Vencem nos próximos 90 dias</div></article>
          </div>
          <div class="dashboard-grid">
            <section class="panel">
              <div class="panel-head"><div><h2 class="panel-title">Medicamentos em atenção</h2><p class="panel-description">Itens com estoque crítico ou próximo do vencimento</p></div><button class="text-link" data-navigate="inventory">Ver estoque →</button></div>
              <div class="table-wrap"><table><thead><tr><th>Medicamento</th><th>Quantidade</th><th>Validade</th><th>Status</th></tr></thead><tbody id="attention-body"></tbody></table></div>
              <div class="empty-state" id="attention-empty" hidden><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg></div><strong>Tudo em ordem!</strong><p>Nenhum medicamento precisa de atenção.</p></div>
            </section>
            <section class="panel">
              <div class="panel-head"><div><h2 class="panel-title">Avisos do estoque</h2><p class="panel-description">Resumo dos itens que precisam de atenção</p></div></div>
              <div class="alert-list" id="alerts-list"></div>
            </section>
          </div>
          <section class="panel section-gap">
            <div class="panel-head"><div><h2 class="panel-title">Últimas movimentações</h2><p class="panel-description">Entradas e saídas mais recentes</p></div><button class="text-link" data-navigate="movements">Ver todas →</button></div>
            <div class="table-wrap"><table><thead><tr><th>Medicamento</th><th>Tipo</th><th>Quantidade</th><th>Data</th><th>Responsável</th></tr></thead><tbody id="recent-movements-body"></tbody></table></div>
            <div class="empty-state" id="recent-movements-empty" hidden><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h13l-3-3M20 7l-3 3"/><path d="M17 17H4l3 3m-3-3 3-3"/></svg></div><strong>Nenhuma movimentação ainda</strong><p>Registre uma entrada ou saída para acompanhar o histórico.</p></div>
          </section>
        </section>

        <section class="page" id="page-inventory">
          <div class="page-heading">
            <div><div class="eyebrow">Gerenciamento</div><h1>Medicamentos</h1><p class="subtitle">Cadastre, consulte e atualize os itens do estoque.</p></div>
            <button class="button button-primary" data-action="add-medicine"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><span class="button-label">Cadastrar medicamento</span></button>
          </div>
          <section class="panel">
            <div class="filters">
              <div class="search-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="medicine-search" type="search" placeholder="Buscar medicamento, princípio ativo, lote..." aria-label="Buscar medicamentos"></div>
              <select id="category-filter" class="filter-select" aria-label="Filtrar por categoria"><option value="">Todas as categorias</option><option>Analgesia</option><option>Antibiótico</option><option>Anti-inflamatório</option><option>Cardiovascular</option><option>Dermatologia</option><option>Gastroenterologia</option><option>Material hospitalar</option><option>Outros</option><option>Respiratório</option></select>
              <select id="status-filter" class="filter-select" aria-label="Filtrar por status"><option value="">Todos os status</option><option value="ok">Estoque adequado</option><option value="low">Estoque baixo</option><option value="out">Sem estoque</option><option value="expiring">Próximo do vencimento</option></select>
              <button class="button button-secondary button-small" id="export-inventory"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5m-5 5V3"/></svg>Exportar CSV</button>
            </div>
            <div class="table-wrap"><table><thead><tr><th>Medicamento</th><th>Categoria</th><th>Quantidade</th><th>Estoque mín.</th><th>Lote</th><th>Validade</th><th>Status</th><th>Ações</th></tr></thead><tbody id="inventory-body"></tbody></table></div>
            <div class="empty-state" id="inventory-empty" hidden><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg></div><strong id="inventory-empty-title">Seu estoque está vazio</strong><p id="inventory-empty-copy">Cadastre o primeiro medicamento para começar.</p></div>
            <div class="table-footer"><span id="inventory-count-label">0 medicamentos</span><span>Dados salvos automaticamente</span></div>
          </section>
        </section>

        <section class="page" id="page-movements">
          <div class="page-heading">
            <div><div class="eyebrow">Histórico</div><h1>Movimentações</h1><p class="subtitle">Consulte cada entrada, saída e ajuste de quantidade.</p></div>
            <button class="button button-primary" data-action="add-movement"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><span class="button-label">Registrar movimentação</span></button>
          </div>
          <section class="panel">
            <div class="filters">
              <div class="search-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="movement-search" type="search" placeholder="Buscar por medicamento ou responsável..." aria-label="Buscar movimentações"></div>
              <select id="movement-type-filter" class="filter-select" aria-label="Filtrar por tipo"><option value="">Todos os tipos</option><option value="Entrada">Entrada</option><option value="Saída">Saída</option><option value="Ajuste">Ajuste</option></select>
            </div>
            <div class="table-wrap"><table><thead><tr><th>Medicamento</th><th>Tipo</th><th>Quantidade</th><th>Saldo após</th><th>Data e hora</th><th>Responsável</th><th>Observação</th></tr></thead><tbody id="movements-body"></tbody></table></div>
            <div class="empty-state" id="movements-empty" hidden><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h13l-3-3M20 7l-3 3"/><path d="M17 17H4l3 3m-3-3 3-3"/></svg></div><strong id="movements-empty-title">Nenhuma movimentação registrada</strong><p id="movements-empty-copy">Registre uma entrada ou saída para começar.</p></div>
            <div class="table-footer"><span id="movements-count-label">0 movimentações</span><span>Histórico de operações do estoque</span></div>
          </section>
        </section>

        <section class="page" id="page-reports">
          <div class="page-heading">
            <div><div class="eyebrow">Acompanhamento</div><h1>Relatórios</h1><p class="subtitle">Resumo do inventário e dos itens que precisam de atenção.</p></div>
            <button class="button button-secondary" id="print-report"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>Imprimir relatório</button>
          </div>
          <div class="stats">
            <article class="stat-card"><div class="stat-top"><span class="stat-label">Itens cadastrados</span><span class="stat-icon teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/></svg></span></div><div class="stat-value" id="report-medicines">0</div><div class="stat-foot">Medicamentos e materiais</div></article>
            <article class="stat-card"><div class="stat-top"><span class="stat-label">Unidades disponíveis</span><span class="stat-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></span></div><div class="stat-value" id="report-units">0</div><div class="stat-foot">Soma das quantidades atuais</div></article>
            <article class="stat-card"><div class="stat-top"><span class="stat-label">Itens abaixo do mínimo</span><span class="stat-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/></svg></span></div><div class="stat-value" id="report-low">0</div><div class="stat-foot">Requerem reposição</div></article>
            <article class="stat-card"><div class="stat-top"><span class="stat-label">Movimentações registradas</span><span class="stat-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 7h13l-3-3M20 7l-3 3M17 17H4l3 3m-3-3 3-3"/></svg></span></div><div class="stat-value" id="report-movements">0</div><div class="stat-foot">Entradas, saídas e ajustes</div></article>
          </div>
          <div class="report-grid">
            <section class="panel"><div class="panel-head"><div><h2 class="panel-title">Medicamentos por categoria</h2><p class="panel-description">Distribuição dos itens cadastrados</p></div></div><div class="category-list" id="category-report"></div></section>
            <section class="panel"><div class="panel-head"><div><h2 class="panel-title">Resumo de atenção</h2><p class="panel-description">Itens que precisam de acompanhamento</p></div></div><div class="report-note" id="report-note"></div></section>
          </div>
          <section class="panel">
            <div class="panel-head"><div><h2 class="panel-title">Estoque completo</h2><p class="panel-description">Posição atual de todos os medicamentos cadastrados</p></div><button class="text-link" data-navigate="inventory">Gerenciar estoque →</button></div>
            <div class="table-wrap"><table><thead><tr><th>Medicamento</th><th>Categoria</th><th>Quantidade</th><th>Estoque mín.</th><th>Lote</th><th>Validade</th><th>Status</th></tr></thead><tbody id="report-inventory-body"></tbody></table></div>
            <div class="empty-state" id="report-inventory-empty" hidden><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/></svg></div><strong>Nenhum item para mostrar</strong><p>Cadastre medicamentos para gerar seu relatório.</p></div>
          </section>
        </section>
      </div>
    </main>
  </div>