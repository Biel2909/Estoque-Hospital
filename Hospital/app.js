(() => {
      "use strict";
      const STORAGE_KEY = "medstock-hospital-v1";
      const PAGE_NAMES = { dashboard: "Painel geral", inventory: "Medicamentos", movements: "Movimentações", reports: "Relatórios" };
      const CATEGORIES = ["Analgesia", "Antibiótico", "Anti-inflamatório", "Cardiovascular", "Dermatologia", "Gastroenterologia", "Material hospitalar", "Outros", "Respiratório"];
      const icon = {
        box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/></svg>',
        alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/></svg>',
        calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>'
      };
      let state = { medicines: [], movements: [] };
      let toastTimer;
      const $ = (selector) => document.querySelector(selector);
      const $$ = (selector) => Array.from(document.querySelectorAll(selector));
      const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
      const numberFormat = (value) => new Intl.NumberFormat("pt-BR").format(value || 0);
      const toLocalDateInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      const dateFromInput = (value) => {
        if (!value) return null;
        const parts = value.split("-").map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]);
      };
      const formatDate = (value) => {
        const date = dateFromInput(value);
        return date ? new Intl.DateTimeFormat("pt-BR").format(date) : "—";
      };
      const formatDateTime = (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
      };
      const todayAtMidnight = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
      };
      const expiryDays = (medicine) => {
        const expiry = dateFromInput(medicine.expiry);
        if (!expiry) return null;
        return Math.ceil((expiry.getTime() - todayAtMidnight().getTime()) / 86400000);
      };
      const getStatus = (medicine) => {
        const days = expiryDays(medicine);
        if (medicine.quantity === 0) return { key: "out", label: "Sem estoque", className: "badge-out" };
        if (days !== null && days < 0) return { key: "expiring", label: "Vencido", className: "badge-expiring" };
        if (days !== null && days <= 90) return { key: "expiring", label: "Vence em breve", className: "badge-expiring" };
        if (medicine.quantity <= medicine.minimum) return { key: "low", label: "Estoque baixo", className: "badge-low" };
        return { key: "ok", label: "Adequado", className: "badge-ok" };
      };
      const medicineById = (id) => state.medicines.find((medicine) => medicine.id === id);
      const persist = () => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          return true;
        } catch (error) {
          console.error("Não foi possível salvar os dados do estoque:", error);
          showToast("Não foi possível salvar. Verifique o espaço disponível e as permissões do navegador.", true);
          return false;
        }
      };
      const load = () => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (!saved) return;
          const parsed = JSON.parse(saved);
          if (!parsed || !Array.isArray(parsed.medicines) || !Array.isArray(parsed.movements)) throw new Error("Formato de dados inválido.");
          state = {
            medicines: parsed.medicines.filter((item) => item && typeof item.id === "string").map((item) => ({
              id: item.id, name: String(item.name || ""), activeIngredient: String(item.activeIngredient || ""),
              presentation: String(item.presentation || ""), category: String(item.category || "Outros"),
              unit: String(item.unit || "unidades"), quantity: Math.max(0, Number(item.quantity) || 0),
              minimum: Math.max(0, Number(item.minimum) || 0), lot: String(item.lot || ""),
              expiry: String(item.expiry || ""), supplier: String(item.supplier || ""),
              updatedAt: String(item.updatedAt || "")
            })),
            movements: parsed.movements.filter((item) => item && typeof item.id === "string").map((item) => ({
              id: item.id, medicineId: String(item.medicineId || ""), medicineName: String(item.medicineName || ""),
              type: ["Entrada", "Saída", "Ajuste"].includes(item.type) ? item.type : "Ajuste",
              quantity: Math.max(0, Number(item.quantity) || 0), balance: Math.max(0, Number(item.balance) || 0),
              responsible: String(item.responsible || ""), notes: String(item.notes || ""), date: String(item.date || "")
            }))
          };
        } catch (error) {
          console.error("Não foi possível carregar os dados salvos do estoque:", error);
          showToast("Os dados salvos não puderam ser lidos. Confira o armazenamento deste navegador.", true);
        }
      };
      function showToast(message, isError = false) {
        const toast = $("#toast");
        toast.innerHTML = `${isError ? icon.alert : icon.check}<span>${escapeHTML(message)}</span>`;
        toast.classList.toggle("error", isError);
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
      }
      function openModal(id) {
        $("#" + id).classList.add("open");
        document.body.style.overflow = "hidden";
        const focusable = $("#" + id).querySelector("input:not([type=hidden]), select, textarea, button");
        if (focusable) setTimeout(() => focusable.focus(), 50);
      }
      function closeModal(id) {
        $("#" + id).classList.remove("open");
        document.body.style.overflow = "";
      }
      function navigate(page) {
        if (!PAGE_NAMES[page]) return;
        $$(".page").forEach((section) => section.classList.toggle("active", section.id === `page-${page}`));
        $$(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.page === page));
        $("#breadcrumb-current").textContent = PAGE_NAMES[page];
        $("#sidebar").classList.remove("open");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      function medicineCell(medicine) {
        const detail = [medicine.activeIngredient, medicine.presentation].filter(Boolean).join(" · ");
        return `<div class="medicine-name">${escapeHTML(medicine.name)}</div><div class="medicine-detail">${escapeHTML(detail || "Sem detalhes adicionais")}</div>`;
      }
      function statusBadge(medicine) {
        const status = getStatus(medicine);
        return `<span class="badge ${status.className}">${status.label}</span>`;
      }
      function medicineTableRow(medicine, withActions = false) {
        const days = expiryDays(medicine);
        const expiryWarning = days !== null && days <= 90;
        return `<tr>
          <td>${medicineCell(medicine)}</td><td>${escapeHTML(medicine.category)}</td>
          <td><span class="stock-number">${numberFormat(medicine.quantity)}</span> ${escapeHTML(medicine.unit)}</td>
          <td>${numberFormat(medicine.minimum)} ${escapeHTML(medicine.unit)}</td>
          <td>${escapeHTML(medicine.lot || "—")}</td>
          <td>${medicine.expiry ? `<span${expiryWarning ? ' style="color:#bd821e;font-weight:650"' : ""}>${formatDate(medicine.expiry)}</span>` : "—"}</td>
          <td>${statusBadge(medicine)}</td>
          ${withActions ? `<td><div class="action-cell">
            <button class="icon-button" data-action="movement-for" data-id="${escapeHTML(medicine.id)}" title="Registrar entrada ou saída" aria-label="Movimentar ${escapeHTML(medicine.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
            <button class="icon-button" data-action="edit-medicine" data-id="${escapeHTML(medicine.id)}" title="Editar" aria-label="Editar ${escapeHTML(medicine.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16 4 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z"/></svg></button>
            <button class="icon-button" data-action="delete-medicine" data-id="${escapeHTML(medicine.id)}" title="Excluir" aria-label="Excluir ${escapeHTML(medicine.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/></svg></button>
          </div></td>` : ""}
        </tr>`;
      }
      function movementRow(movement, detailed = true) {
        const typeClass = movement.type === "Entrada" ? "movement-in" : movement.type === "Saída" ? "movement-out" : "movement-adjustment";
        return `<tr><td><div class="medicine-name">${escapeHTML(movement.medicineName)}</div></td>
          <td><span class="movement-tag ${typeClass}">${movement.type === "Entrada" ? "↑" : movement.type === "Saída" ? "↓" : "↔"} ${escapeHTML(movement.type)}</span></td>
          <td>${movement.type === "Entrada" ? "+" : movement.type === "Saída" ? "−" : "±"}${numberFormat(movement.quantity)}</td>
          ${detailed ? `<td>${numberFormat(movement.balance)}</td>` : ""}
          <td>${formatDateTime(movement.date)}</td><td>${escapeHTML(movement.responsible || "—")}</td>
          ${detailed ? `<td>${escapeHTML(movement.notes || "—")}</td>` : ""}</tr>`;
      }
      function renderDashboard() {
        const medicines = state.medicines;
        const low = medicines.filter((item) => item.quantity <= item.minimum);
        const expiring = medicines.filter((item) => {
          const days = expiryDays(item);
          return days !== null && days >= 0 && days <= 90;
        });
        const attention = medicines.filter((item) => item.quantity <= item.minimum || (expiryDays(item) !== null && expiryDays(item) <= 90)).sort((a, b) => {
          const priority = (item) => item.quantity === 0 ? 0 : item.quantity <= item.minimum ? 1 : 2;
          return priority(a) - priority(b) || (expiryDays(a) ?? Infinity) - (expiryDays(b) ?? Infinity);
        }).slice(0, 6);
        $("#stat-medicines").textContent = numberFormat(medicines.length);
        $("#stat-units").textContent = numberFormat(medicines.reduce((total, item) => total + item.quantity, 0));
        $("#stat-low").textContent = numberFormat(low.length);
        $("#stat-expiring").textContent = numberFormat(expiring.length);
        $("#medicine-count").textContent = numberFormat(medicines.length);
        $("#attention-body").innerHTML = attention.map((item) => `<tr><td>${medicineCell(item)}</td><td><span class="stock-number">${numberFormat(item.quantity)}</span> ${escapeHTML(item.unit)}</td><td>${item.expiry ? formatDate(item.expiry) : "—"}</td><td>${statusBadge(item)}</td></tr>`).join("");
        $("#attention-empty").hidden = attention.length > 0;
        $("#alerts-list").innerHTML = buildAlerts(low, expiring);
        const recent = state.movements.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        $("#recent-movements-body").innerHTML = recent.map((item) => movementRow(item, false)).join("");
        $("#recent-movements-empty").hidden = recent.length > 0;
      }
      function buildAlerts(low, expiring) {
        const alerts = [];
        const outOfStock = low.filter((item) => item.quantity === 0);
        const lowStock = low.filter((item) => item.quantity > 0);
        if (outOfStock.length) alerts.push(`<div class="alert-item"><div class="alert-icon danger">${icon.alert}</div><div><div class="alert-title">${numberFormat(outOfStock.length)} sem estoque</div><div class="alert-subtitle">${outOfStock.slice(0, 2).map((item) => escapeHTML(item.name)).join(", ")}${outOfStock.length > 2 ? ` e mais ${outOfStock.length - 2}` : ""}</div></div></div>`);
        if (lowStock.length) alerts.push(`<div class="alert-item"><div class="alert-icon warning">${icon.box}</div><div><div class="alert-title">${numberFormat(lowStock.length)} com estoque baixo</div><div class="alert-subtitle">Abaixo ou no limite mínimo cadastrado</div></div></div>`);
        if (expiring.length) alerts.push(`<div class="alert-item"><div class="alert-icon info">${icon.calendar}</div><div><div class="alert-title">${numberFormat(expiring.length)} próximos do vencimento</div><div class="alert-subtitle">Vencem dentro de 90 dias</div></div></div>`);
        if (!alerts.length) return `<div class="empty-state"><div class="empty-icon">${icon.check}</div><strong>Nenhum aviso</strong><p>O estoque não tem alertas no momento.</p></div>`;
        return alerts.join("");
      }
      function renderInventory() {
        const query = $("#medicine-search").value.trim().toLocaleLowerCase("pt-BR");
        const category = $("#category-filter").value;
        const status = $("#status-filter").value;
        const filtered = state.medicines.filter((item) => {
          const searchable = [item.name, item.activeIngredient, item.presentation, item.lot, item.supplier].join(" ").toLocaleLowerCase("pt-BR");
          return (!query || searchable.includes(query)) && (!category || item.category === category) && (!status || getStatus(item).key === status);
        }).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        $("#inventory-body").innerHTML = filtered.map((item) => medicineTableRow(item, true)).join("");
        $("#inventory-empty").hidden = filtered.length > 0;
        $("#inventory-empty-title").textContent = state.medicines.length ? "Nenhum medicamento encontrado" : "Seu estoque está vazio";
        $("#inventory-empty-copy").textContent = state.medicines.length ? "Tente ajustar a busca ou os filtros selecionados." : "Cadastre o primeiro medicamento para começar.";
        $("#inventory-count-label").textContent = `${numberFormat(filtered.length)} de ${numberFormat(state.medicines.length)} medicamento${state.medicines.length === 1 ? "" : "s"}`;
      }
      function renderMovements() {
        const query = $("#movement-search").value.trim().toLocaleLowerCase("pt-BR");
        const type = $("#movement-type-filter").value;
        const filtered = state.movements.filter((item) => (!type || item.type === type) && (!query || [item.medicineName, item.responsible, item.notes].join(" ").toLocaleLowerCase("pt-BR").includes(query))).sort((a, b) => new Date(b.date) - new Date(a.date));
        $("#movements-body").innerHTML = filtered.map((item) => movementRow(item, true)).join("");
        $("#movements-empty").hidden = filtered.length > 0;
        $("#movements-empty-title").textContent = state.movements.length ? "Nenhuma movimentação encontrada" : "Nenhuma movimentação registrada";
        $("#movements-empty-copy").textContent = state.movements.length ? "Tente ajustar a busca ou o filtro selecionado." : "Registre uma entrada ou saída para começar.";
        $("#movements-count-label").textContent = `${numberFormat(filtered.length)} movimentaç${filtered.length === 1 ? "ão" : "ões"}`;
      }
      function renderReports() {
        const medicines = state.medicines;
        const low = medicines.filter((item) => item.quantity <= item.minimum);
        const expired = medicines.filter((item) => {
          const days = expiryDays(item);
          return days !== null && days < 0;
        });
        const expiring = medicines.filter((item) => {
          const days = expiryDays(item);
          return days !== null && days >= 0 && days <= 90;
        });
        $("#report-medicines").textContent = numberFormat(medicines.length);
        $("#report-units").textContent = numberFormat(medicines.reduce((total, item) => total + item.quantity, 0));
        $("#report-low").textContent = numberFormat(low.length);
        $("#report-movements").textContent = numberFormat(state.movements.length);
        const counts = CATEGORIES.map((category) => ({ category, count: medicines.filter((item) => item.category === category).length })).filter((item) => item.count > 0);
        const max = Math.max(1, ...counts.map((item) => item.count));
        $("#category-report").innerHTML = counts.length ? counts.map((item) => `<div class="category-row"><span>${escapeHTML(item.category)}</span><div class="progress-track"><div class="progress-fill" style="width:${Math.max(4, item.count / max * 100)}%"></div></div><span class="category-count">${numberFormat(item.count)}</span></div>`).join("") : `<div class="empty-state"><strong>Sem categorias cadastradas</strong><p>Adicione medicamentos para visualizar a distribuição.</p></div>`;
        $("#report-note").innerHTML = medicines.length
          ? `<strong style="color:#344158">${numberFormat(medicines.length)} medicamento${medicines.length === 1 ? "" : "s"}</strong> cadastrado${medicines.length === 1 ? "" : "s"}, totalizando <strong style="color:#344158">${numberFormat(medicines.reduce((total, item) => total + item.quantity, 0))} unidades</strong> em estoque.<br><br>${numberFormat(low.length)} item${low.length === 1 ? "" : "s"} com estoque baixo, ${numberFormat(expiring.length)} próximo${expiring.length === 1 ? "" : "s"} do vencimento e ${numberFormat(expired.length)} vencido${expired.length === 1 ? "" : "s"}. Revise a validade e a reposição dos itens regularmente.`
          : "Nenhum medicamento cadastrado. Depois de adicionar itens, este resumo mostrará os totais e os alertas do estoque.";
        $("#report-inventory-body").innerHTML = medicines.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR")).map((item) => medicineTableRow(item)).join("");
        $("#report-inventory-empty").hidden = medicines.length > 0;
      }
      function render() {
        renderDashboard();
        renderInventory();
        renderMovements();
        renderReports();
      }
      function resetMedicineForm() {
        $("#medicine-form").reset();
        $("#medicine-id").value = "";
        $("#medicine-modal-title").textContent = "Cadastrar medicamento";
        $("#medicine-quantity").value = "0";
        $("#medicine-minimum").value = "10";
        $("#medicine-quantity").disabled = false;
        $("#medicine-quantity").removeAttribute("aria-describedby");
        $("#medicine-quantity").title = "";
      }
      function addMedicine() {
        resetMedicineForm();
        openModal("medicine-modal");
      }
      function editMedicine(id) {
        const medicine = medicineById(id);
        if (!medicine) return showToast("Medicamento não encontrado.", true);
        resetMedicineForm();
        $("#medicine-modal-title").textContent = "Editar medicamento";
        $("#medicine-id").value = medicine.id;
        $("#medicine-name").value = medicine.name;
        $("#medicine-active").value = medicine.activeIngredient;
        $("#medicine-presentation").value = medicine.presentation;
        $("#medicine-category").value = CATEGORIES.includes(medicine.category) ? medicine.category : "Outros";
        $("#medicine-unit").value = medicine.unit;
        $("#medicine-quantity").value = medicine.quantity;
        $("#medicine-minimum").value = medicine.minimum;
        $("#medicine-lot").value = medicine.lot;
        $("#medicine-expiry").value = medicine.expiry;
        $("#medicine-supplier").value = medicine.supplier;
        $("#medicine-quantity").disabled = true;
        $("#medicine-quantity").title = "Para alterar a quantidade, registre uma movimentação.";
        $("#medicine-quantity").setAttribute("aria-describedby", "quantity-help");
        openModal("medicine-modal");
      }
      function openMovement(medicineId) {
        if (!state.medicines.length) {
          navigate("inventory");
          showToast("Cadastre um medicamento antes de registrar movimentações.", true);
          return;
        }
        const select = $("#movement-medicine");
        select.innerHTML = `<option value="">Selecione um medicamento</option>` + state.medicines.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR")).map((item) => `<option value="${escapeHTML(item.id)}">${escapeHTML(item.name)} — ${numberFormat(item.quantity)} ${escapeHTML(item.unit)}</option>`).join("");
        if (medicineId) select.value = medicineId;
        $("#movement-form").reset();
        if (medicineId) select.value = medicineId;
        $("#movement-type").value = "Entrada";
        $("#movement-quantity").value = "";
        updateMovementHint();
        openModal("movement-modal");
      }
      function updateMovementHint() {
        const medicine = medicineById($("#movement-medicine").value);
        const hint = $("#movement-quantity-hint");
        if (!medicine) {
          hint.textContent = "Informe uma quantidade maior que zero.";
          return;
        }
        hint.textContent = $("#movement-type").value === "Ajuste"
          ? `Ajuste define o saldo final. Saldo atual: ${numberFormat(medicine.quantity)} ${medicine.unit}.`
          : `Saldo atual: ${numberFormat(medicine.quantity)} ${medicine.unit}.`;
      }
      function csvCell(value) {
        return `"${String(value ?? "").replace(/"/g, '""')}"`;
      }
      function exportCSV() {
        if (!state.medicines.length) {
          showToast("Não há medicamentos para exportar.", true);
          return;
        }
        const rows = [["Medicamento", "Princípio ativo", "Apresentação", "Categoria", "Quantidade", "Unidade", "Estoque mínimo", "Lote", "Validade", "Fornecedor", "Status"]];
        state.medicines.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR")).forEach((item) => {
          rows.push([item.name, item.activeIngredient, item.presentation, item.category, item.quantity, item.unit, item.minimum, item.lot, item.expiry ? formatDate(item.expiry) : "", item.supplier, getStatus(item).label]);
        });
        const content = "\uFEFF" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");
        const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `estoque-medicamentos-${toLocalDateInput(new Date())}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast("Relatório CSV exportado.");
      }

      $$(".nav-button").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.page)));
      $$("[data-navigate]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.navigate)));
      $$("[data-action='add-medicine']").forEach((button) => button.addEventListener("click", addMedicine));
      $$("[data-action='add-movement']").forEach((button) => button.addEventListener("click", () => openMovement()));
      $$("[data-close]").forEach((button) => button.addEventListener("click", () => closeModal(button.dataset.close)));
      $$(".modal-backdrop").forEach((backdrop) => backdrop.addEventListener("mousedown", (event) => {
        if (event.target === backdrop) closeModal(backdrop.id);
      }));
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") $$(".modal-backdrop.open").forEach((modal) => closeModal(modal.id));
      });
      $("#mobile-menu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
      $("#medicine-search").addEventListener("input", renderInventory);
      $("#category-filter").addEventListener("change", renderInventory);
      $("#status-filter").addEventListener("change", renderInventory);
      $("#movement-search").addEventListener("input", renderMovements);
      $("#movement-type-filter").addEventListener("change", renderMovements);
      $("#movement-medicine").addEventListener("change", updateMovementHint);
      $("#movement-type").addEventListener("change", updateMovementHint);
      $("#export-inventory").addEventListener("click", exportCSV);
      $("#print-report").addEventListener("click", () => window.print());
      document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-action]");
        if (!button) return;
        const id = button.dataset.id;
        if (button.dataset.action === "edit-medicine") editMedicine(id);
        if (button.dataset.action === "movement-for") openMovement(id);
        if (button.dataset.action === "delete-medicine") {
          const medicine = medicineById(id);
          if (!medicine) return showToast("Medicamento não encontrado.", true);
          const linked = state.movements.some((movement) => movement.medicineId === id);
          const confirmation = linked
            ? `Excluir "${medicine.name}"? O histórico de movimentações será mantido.`
            : `Excluir "${medicine.name}" do estoque?`;
          if (!window.confirm(confirmation)) return;
          const original = state.medicines;
          state.medicines = state.medicines.filter((item) => item.id !== id);
          if (!persist()) {
            state.medicines = original;
            return;
          }
          render();
          showToast("Medicamento excluído.");
        }
      });
      $("#medicine-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const id = $("#medicine-id").value;
        const existing = id ? medicineById(id) : null;
        if (id && !existing) return showToast("Medicamento não encontrado. Atualize a página e tente novamente.", true);
        const medicine = {
          id: existing ? existing.id : (window.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`),
          name: $("#medicine-name").value.trim(),
          activeIngredient: $("#medicine-active").value.trim(),
          presentation: $("#medicine-presentation").value.trim(),
          category: $("#medicine-category").value,
          unit: $("#medicine-unit").value,
          quantity: existing ? existing.quantity : Number($("#medicine-quantity").value),
          minimum: Number($("#medicine-minimum").value),
          lot: $("#medicine-lot").value.trim(),
          expiry: $("#medicine-expiry").value,
          supplier: $("#medicine-supplier").value.trim(),
          updatedAt: new Date().toISOString()
        };
        if (!medicine.name || !medicine.presentation || !CATEGORIES.includes(medicine.category) || !Number.isInteger(medicine.quantity) || medicine.quantity < 0 || !Number.isInteger(medicine.minimum) || medicine.minimum < 0) {
          showToast("Confira os campos obrigatórios e informe quantidades inteiras válidas.", true);
          return;
        }
        if (!medicine.unit || (medicine.expiry && !dateFromInput(medicine.expiry))) {
          showToast("Confira a unidade de medida e a data de validade.", true);
          return;
        }
        if (state.medicines.some((item) => item.id !== medicine.id && item.name.toLocaleLowerCase("pt-BR") === medicine.name.toLocaleLowerCase("pt-BR") && item.presentation.toLocaleLowerCase("pt-BR") === medicine.presentation.toLocaleLowerCase("pt-BR"))) {
          showToast("Já existe um medicamento com esse nome e apresentação.", true);
          return;
        }
        const previous = state.medicines;
        state.medicines = existing ? state.medicines.map((item) => item.id === id ? medicine : item) : [...state.medicines, medicine];
        if (!persist()) {
          state.medicines = previous;
          return;
        }
        closeModal("medicine-modal");
        render();
        showToast(existing ? "Medicamento atualizado com sucesso." : "Medicamento cadastrado com sucesso.");
      });
      $("#movement-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const medicine = medicineById($("#movement-medicine").value);
        const quantity = Number($("#movement-quantity").value);
        const type = $("#movement-type").value;
        if (!medicine || !["Entrada", "Saída", "Ajuste"].includes(type) || !Number.isInteger(quantity) || quantity < 1) {
          showToast("Selecione um medicamento e informe uma quantidade inteira maior que zero.", true);
          return;
        }
        if (type === "Saída" && quantity > medicine.quantity) {
          showToast(`Saída não permitida: há apenas ${numberFormat(medicine.quantity)} ${medicine.unit} em estoque.`, true);
          return;
        }
        const balance = type === "Entrada" ? medicine.quantity + quantity : type === "Saída" ? medicine.quantity - quantity : quantity;
        const previousMedicines = state.medicines;
        const previousMovements = state.movements;
        const updatedMedicine = { ...medicine, quantity: balance, updatedAt: new Date().toISOString() };
        const movement = {
          id: window.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          medicineId: medicine.id, medicineName: medicine.name, type, quantity,
          balance, responsible: $("#movement-responsible").value.trim(),
          notes: $("#movement-notes").value.trim(), date: new Date().toISOString()
        };
        state.medicines = state.medicines.map((item) => item.id === medicine.id ? updatedMedicine : item);
        state.movements = [...state.movements, movement];
        if (!persist()) {
          state.medicines = previousMedicines;
          state.movements = previousMovements;
          return;
        }
        closeModal("movement-modal");
        render();
        showToast(`${type} registrada. Saldo atualizado para ${numberFormat(balance)} ${medicine.unit}.`);
      });

      $("#today").textContent = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(new Date());
      load();
      render();
    })();
