document.addEventListener("DOMContentLoaded", () => {

    /* ============================
       CONSTANTES LOCALSTORAGE
    ============================ */
    const LS_USERS   = "CITECH_users_v1";
    const LS_STORE   = "CITECH_store_v1";
    const LS_MARKET  = "CITECH_market_v1";
    const LS_MOV     = "CITECH_movements_v1";
    const LS_CURRENT = "CITECH_currentUser_v1";

    let users   = JSON.parse(localStorage.getItem(LS_USERS)   || "[]");
    let store   = JSON.parse(localStorage.getItem(LS_STORE)   || "[]");
    let market  = JSON.parse(localStorage.getItem(LS_MARKET)  || "[]");
    let movs    = JSON.parse(localStorage.getItem(LS_MOV)     || "[]");
    let current = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");

    if (!current || current.rol !== "admin") {
        alert("No tienes permisos para acceder al panel administrador.");
        window.location.href = "../index/index.xml";
        return;
    }

    /* ============================
       CAMBIO DE PANELES
    ============================ */
    const sidebar = document.querySelectorAll(".admin-sidebar li");
    const panels  = document.querySelectorAll(".panel");

    sidebar.forEach(item => {
        item.addEventListener("click", () => {
            sidebar.forEach(i => i.classList.remove("sel"));
            item.classList.add("sel");

            const target = item.dataset.panel;

            panels.forEach(p => p.classList.remove("active"));
            document.getElementById("panel-" + target).classList.add("active");

            // refrescar listas por panel
            if (target === "tienda") loadStore();
            if (target === "marketplace") loadMarket();
            if (target === "movimientos") loadMovimientos();
        });
    });

    /* ============================
       DASHBOARD
    ============================ */
    function refreshDashboard() {
        users  = JSON.parse(localStorage.getItem(LS_USERS)  || "[]");
        store  = JSON.parse(localStorage.getItem(LS_STORE)  || "[]");
        market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");
        movs   = JSON.parse(localStorage.getItem(LS_MOV)    || "[]");

        document.getElementById("count-users-val").textContent  = users.length;
        document.getElementById("count-store-val").textContent  = store.length;
        document.getElementById("count-market-val").textContent = market.length;
        document.getElementById("count-mov-val").textContent    = movs.length;
    }

    refreshDashboard();

    /* ============================
       TIENDA — LISTA
    ============================ */
    const storeList = document.getElementById("store-list");

    function loadStore() {
        store = JSON.parse(localStorage.getItem(LS_STORE) || "[]");

        if (!store.length) {
            storeList.innerHTML = "<p>No hay productos en tienda.</p>";
            return;
        }

        let html = `
            <table class="tbl">
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                </tr>
        `;

        store.forEach(p => {
            html += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.precio}€</td>
                    <td>${p.stock}</td>
                    <td>${p.categoria}</td>
                    <td>
                      <button class="btn small" data-id="${p.id}" data-action="edit-store">Editar</button>
                      <button class="btn small danger" data-id="${p.id}" data-action="del-store">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        html += "</table>";
        storeList.innerHTML = html;
    }

    /* ============================
       TIENDA — MODAL FORM
    ============================ */
    const modal       = document.getElementById("store-form-modal");
    const btnAddStore = document.getElementById("btn-add-store");
    const btnSave     = document.getElementById("store-save");
    const btnCancel   = document.getElementById("store-cancel");

    const fNombre   = document.getElementById("store-nombre");
    const fPrecio   = document.getElementById("store-precio");
    const fStock    = document.getElementById("store-stock");
    const fCat      = document.getElementById("store-categoria");
    const fDesc     = document.getElementById("store-desc");
    const fImg      = document.getElementById("store-img");
    const fPreview  = document.getElementById("store-img-preview");
    const formTitle = document.getElementById("store-form-title");

    let editingID = null;

    btnAddStore.onclick = () => {
        editingID = null;
        formTitle.textContent = "Nuevo producto";
        fNombre.value = "";
        fPrecio.value = "";
        fStock.value  = "";
        fCat.value    = "componentes";
        fDesc.value   = "";
        fPreview.src  = "../img/default_product.png";
        modal.classList.remove("hidden");
    };

    btnCancel.onclick = () => modal.classList.add("hidden");

    /* Imagen preview */
    fImg.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => fPreview.src = reader.result;
        reader.readAsDataURL(file);
    };

    /* Guardar producto */
    btnSave.onclick = () => {
        let img = fPreview.src;

        if (!fNombre.value || !fPrecio.value || !fStock.value) {
            alert("Rellena todos los campos obligatorios.");
            return;
        }

        store = JSON.parse(localStorage.getItem(LS_STORE) || "[]");

        if (editingID) {
            /* EDITAR PRODUCTO */
            let prod = store.find(p => p.id === editingID);
            prod.nombre    = fNombre.value;
            prod.precio    = Number(fPrecio.value);
            prod.stock     = Number(fStock.value);
            prod.categoria = fCat.value;
            prod.descripcion = fDesc.value;
            prod.imagen    = img;
        } else {
            /* NUEVO PRODUCTO */
            store.push({
                id: "store_" + Date.now(),
                nombre: fNombre.value,
                precio: Number(fPrecio.value),
                stock: Number(fStock.value),
                categoria: fCat.value,
                descripcion: fDesc.value,
                imagen: img
            });
        }

        localStorage.setItem(LS_STORE, JSON.stringify(store));
        loadStore();
        refreshDashboard();
        modal.classList.add("hidden");
    };

    /* ============================
       TIENDA — ACCIONES
    ============================ */
    document.addEventListener("click", e => {
        if (!e.target.matches("[data-action]")) return;

        const id = e.target.dataset.id;
        const action = e.target.dataset.action;

        /* ELIMINAR PRODUCTO */
        if (action === "del-store") {
            if (!confirm("¿Eliminar este producto?")) return;
            store = store.filter(p => p.id !== id);
            localStorage.setItem(LS_STORE, JSON.stringify(store));
            loadStore();
            refreshDashboard();
        }

        /* EDITAR PRODUCTO */
        if (action === "edit-store") {
            const prod = store.find(p => p.id === id);
            if (!prod) return;

            editingID = id;
            formTitle.textContent = "Editar producto";

            fNombre.value = prod.nombre;
            fPrecio.value = prod.precio;
            fStock.value  = prod.stock;
            fCat.value    = prod.categoria;
            fDesc.value   = prod.descripcion;
            fPreview.src  = prod.imagen;

            modal.classList.remove("hidden");
        }
    });

    /* ============================
       MARKETPLACE
    ============================ */
    function loadMarket() {
        market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");
        users  = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

        const cont = document.getElementById("market-list");

        if (!market.length) {
            cont.innerHTML = "<p>No hay anuncios en marketplace.</p>";
            return;
        }

        let html = `
        <table class="tbl">
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Vendedor</th>
          </tr>
        `;

        market.forEach(p => {
            const v = users.find(u => u.id === p.vendedor);
            html += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.precio}€</td>
                    <td>${p.categoria}</td>
                    <td>${p.stock}</td>
                    <td>${v ? v.usuario : "?"}</td>
                </tr>
            `;
        });

        html += "</table>";
        cont.innerHTML = html;
    }

    /* ============================
       MOVIMIENTOS
    ============================ */
    const movList = document.getElementById("mov-list");
    const movSearch = document.getElementById("mov-search");

    function loadMovimientos() {
        movs = JSON.parse(localStorage.getItem(LS_MOV) || "[]");
        users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

        let q = movSearch.value.toLowerCase();
        let lista = movs.filter(m => {
            const user = users.find(u => u.id === m.usuario) || {};
            return (
                (user.usuario || "").toLowerCase().includes(q) ||
                (m.descripcion || "").toLowerCase().includes(q)
            );
        });

        if (!lista.length) {
            movList.innerHTML = "<p>No hay movimientos registrados.</p>";
            return;
        }

        let html = `
        <table class="tbl">
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Descripción</th>
            </tr>
        `;

        lista.forEach(m => {
            const user = users.find(u => u.id === m.usuario);
            html += `
                <tr>
                    <td>${new Date(m.fecha).toLocaleString()}</td>
                    <td>${user ? user.usuario : "?"}</td>
                    <td>${m.tipo}</td>
                    <td>${m.monto}€</td>
                    <td>${m.descripcion}</td>
                </tr>
            `;
        });

        html += "</table>";
        movList.innerHTML = html;
    }

    movSearch.oninput = loadMovimientos;

    /* ============================
       HERRAMIENTAS
    ============================ */
    document.getElementById("btn-clear-market").onclick = () => {
        if (!confirm("¿Vaciar marketplace?")) return;
        localStorage.setItem(LS_MARKET, "[]");
        loadMarket();
        refreshDashboard();
    };

    document.getElementById("btn-recalc").onclick = () => {
        refreshDashboard();
        loadStore();
        loadMarket();
        loadMovimientos();
        alert("Datos actualizados.");
    };

    /* ============================
       LOGOUT
    ============================ */
    document.getElementById("btn-admin-logout").onclick = () => {
        localStorage.removeItem(LS_CURRENT);
        window.location.href = "../index/index.xml";
    };

    /* ============================
       INICIALIZACIÓN
    ============================ */
    loadStore();
    loadMarket();
    loadMovimientos();
});
