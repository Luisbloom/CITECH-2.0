document.addEventListener("DOMContentLoaded", () => {

    /* ============================
       CONSTANTES
    ============================ */
    const LS_USERS   = "CITECH_users_v1";
    const LS_MARKET  = "CITECH_market_v1";
    const LS_CART    = "CITECH_cart_v1";
    const LS_MOV     = "CITECH_movements_v1";
    const LS_BUYS    = "CITECH_buys_v1";
    const LS_CURRENT = "CITECH_currentUser_v1";

    let current = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");
    let users   = JSON.parse(localStorage.getItem(LS_USERS)   || "[]");
    let market  = JSON.parse(localStorage.getItem(LS_MARKET)  || "[]");
    let movs    = JSON.parse(localStorage.getItem(LS_MOV)     || "[]");
    let buys    = JSON.parse(localStorage.getItem(LS_BUYS)    || "[]");

    if (!current || current.rol !== "admin") {
        alert("No tienes permisos para acceder al panel administrador.");
        window.location.href = "../index/index.xml";
        return;
    }

    /* =====================================
       SIDEBAR — CAMBIO DE PANELES
    ===================================== */
    const sidebar = document.querySelectorAll(".admin-sidebar li");
    const panels  = document.querySelectorAll(".panel");

    sidebar.forEach(item => {
        item.addEventListener("click", () => {
            sidebar.forEach(i => i.classList.remove("sel"));
            item.classList.add("sel");

            const target = item.getAttribute("data-panel");

            panels.forEach(panel => panel.classList.remove("active"));

            const panelTarget = document.getElementById(`panel-${target}`);
            if (panelTarget) panelTarget.classList.add("active");
        });
    });

    /* =====================================
       DASHBOARD
    ===================================== */
    function refreshDashboard() {
        users  = JSON.parse(localStorage.getItem(LS_USERS)  || "[]");
        market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");
        movs   = JSON.parse(localStorage.getItem(LS_MOV)    || "[]");
        buys   = JSON.parse(localStorage.getItem(LS_BUYS)   || "[]");

        document.getElementById("count-users-val").textContent  = users.length;
        document.getElementById("count-market-val").textContent = market.length;
        document.getElementById("count-mov-val").textContent    = movs.length;
        document.getElementById("count-buys-val").textContent   = buys.length;
    }

    refreshDashboard();


    /* =====================================
       USUARIOS
    ===================================== */
    function loadUsuarios() {
        users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
        const cont = document.getElementById("usuarios-list");

        if (!users.length) {
            cont.innerHTML = "<p>No hay usuarios registrados.</p>";
            return;
        }

        let html = `
            <table>
                <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
        `;

        users.forEach(u => {
            html += `
               <tr>
                   <td>${u.usuario}</td>
                   <td>${u.email}</td>
                   <td>${u.telefono}</td>
                   <td>${u.rol}</td>
                   <td>
                       <button class="btn small" data-id="${u.id}" data-action="admin">Hacer Admin</button>
                       <button class="btn small danger" data-id="${u.id}" data-action="del">Eliminar</button>
                   </td>
               </tr>`;
        });

        html += "</table>";
        cont.innerHTML = html;
    }

    loadUsuarios();


    /* =====================================
       MARKETPLACE 
    ===================================== */
    function loadMarket() {
        market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");
        users  = JSON.parse(localStorage.getItem(LS_USERS)  || "[]");

        const cont = document.getElementById("market-list");
        const q    = document.getElementById("market-search").value.toLowerCase();
        const cat  = document.getElementById("market-filter-cat").value;

        let productos = [...market];

        if (q) {
            productos = productos.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                users.find(u => u.id === p.vendedor)?.usuario.toLowerCase().includes(q)
            );
        }

        if (cat !== "todos") {
            productos = productos.filter(p => p.categoria === cat);
        }

        if (!productos.length) {
            cont.innerHTML = "<p>No hay productos.</p>";
            return;
        }

        let html = `
            <table>
                <tr>
                    <th>Producto</th><th>Precio</th>
                    <th>Categoría</th><th>Stock</th>
                    <th>Vendedor</th>
                </tr>
        `;

        productos.forEach(p => {
            const v = users.find(u => u.id === p.vendedor);

            html += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.precio}€</td>
                <td>${p.categoria}</td>
                <td>${p.stock}</td>
                <td>${v ? v.usuario + " (" + v.email + ")" : "?"}</td>
            </tr>
            `;
        });

        html += "</table>";
        cont.innerHTML = html;
    }

    document.getElementById("btn-refrescar-market").onclick = loadMarket;
    document.getElementById("market-search").oninput = loadMarket;
    document.getElementById("market-filter-cat").onchange = loadMarket;


    /* =====================================
       MOVIMIENTOS (con filtros funcionales)
    ===================================== */
    function loadMovimientos() {
        movs   = JSON.parse(localStorage.getItem(LS_MOV) || "[]");
        users  = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

        const cont = document.getElementById("mov-list");
        const q    = document.getElementById("mov-search").value.toLowerCase();
        const fil  = document.getElementById("mov-filter-type").value;

        let resultados = [...movs];

        if (fil !== "todos") {
            resultados = resultados.filter(m => m.tipo === fil);
        }

        if (q) {
            resultados = resultados.filter(m => {
                const user = users.find(u => u.id === m.usuario);
                const uname = user ? user.usuario.toLowerCase() : "";
                const email = user ? user.email.toLowerCase() : "";

                return (
                    uname.includes(q) ||
                    email.includes(q) ||
                    m.tipo.toLowerCase().includes(q) ||
                    m.descripcion.toLowerCase().includes(q)
                );
            });
        }

        if (!resultados.length) {
            cont.innerHTML = "<p>No hay movimientos que coincidan.</p>";
            return;
        }

        let html = `
        <table>
            <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Descripción</th>
            </tr>
        `;

        resultados.forEach(m => {
            const user = users.find(u => u.id === m.usuario);
            const visibleUser = user ? `${user.usuario} (${user.email})` : "Desconocido";

            html += `
                <tr>
                    <td>${new Date(m.fecha).toLocaleString()}</td>
                    <td>${visibleUser}</td>
                    <td>${m.tipo}</td>
                    <td>${m.monto}€</td>
                    <td>${m.descripcion}</td>
                </tr>
            `;
        });

        html += "</table>";
        cont.innerHTML = html;
    }

    document.getElementById("mov-search").oninput = loadMovimientos;
    document.getElementById("mov-filter-type").onchange = loadMovimientos;
    document.getElementById("btn-export-mov").onclick = loadMovimientos;


    /* =====================================
       COMPRAS (con filtros funcionales)
    ===================================== */
    function loadCompras() {
        buys  = JSON.parse(localStorage.getItem(LS_BUYS) || "[]");
        users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

        const cont = document.getElementById("buys-list");
        const q    = document.getElementById("buys-search").value.toLowerCase();

        let lista = [...buys];

        if (q) {
            lista = lista.filter(b => {
                const user = users.find(u => u.id === b.usuario);
                const uname = user ? user.usuario.toLowerCase() : "";
                const email = user ? user.email.toLowerCase() : "";

                return (
                    uname.includes(q) ||
                    email.includes(q) ||
                    b.producto.toLowerCase().includes(q)
                );
            });
        }

        if (!lista.length) {
            cont.innerHTML = "<p>No hay compras registradas.</p>";
            return;
        }

        let html = `
        <table>
            <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
            </tr>
        `;

        lista.forEach(b => {
            const user = users.find(u => u.id === b.usuario);
            const visibleUser = user ? `${user.usuario} (${user.email})` : "Desconocido";

            html += `
                <tr>
                    <td>${new Date(b.fecha).toLocaleString()}</td>
                    <td>${visibleUser}</td>
                    <td>${b.producto}</td>
                    <td>${b.qty}</td>
                    <td>${b.total}€</td>
                </tr>`;
        });

        html += "</table>";
        cont.innerHTML = html;
    }

    document.getElementById("buys-search").oninput = loadCompras;
    document.getElementById("btn-refrescar-buys").onclick = loadCompras;


    /* =====================================
       BOTÓN GLOBAL DE RECARGA
    ===================================== */
    const btnRecalc = document.querySelector("#btn-recalc");
    if (btnRecalc) {
        btnRecalc.onclick = () => {
            refreshDashboard();
            loadUsuarios();
            loadMarket();
            loadMovimientos();
            loadCompras();
            alert("Totales recalculados.");
        };
    }


    /* =====================================
       BOTÓN CLEAR MARKET
    ===================================== */
    const btnClearMarket = document.querySelector("#btn-clear-market");
    if (btnClearMarket) {
        btnClearMarket.onclick = () => {
            if (!confirm("¿Seguro que deseas eliminar TODO el marketplace?")) return;

            localStorage.setItem(LS_MARKET, "[]");
            loadMarket();
            refreshDashboard();
        };
    }


    /* =====================================
       LOGOUT ADMIN
    ===================================== */
    const btnLogout = document.querySelector("#btn-admin-logout");

    if (btnLogout) {
        btnLogout.onclick = () => {
            localStorage.removeItem(LS_CURRENT);
            window.location.href = "../index/index.xml";
        };
    }


    /* =====================================
       DELEGACIÓN: BOTONES ADMIN / DEL
    ===================================== */
    document.addEventListener("click", e => {

        if (e.target.matches("[data-action]")) {
            let id = e.target.dataset.id;
            let action = e.target.dataset.action;

            // HACER ADMIN
            if (action === "admin") {
                users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
                let u = users.find(x => x.id === id);
                if (!u) return;

                u.rol = "admin";
                localStorage.setItem(LS_USERS, JSON.stringify(users));
                alert("Ahora es administrador.");
                loadUsuarios();
            }

            // ELIMINAR USUARIO
            if (action === "del") {
                let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
                users = users.filter(u => u.id !== id);
                localStorage.setItem(LS_USERS, JSON.stringify(users));
                alert("Usuario eliminado.");
                loadUsuarios();
            }
        }
    });


    /* =====================================
       INICIALIZACIÓN
    ===================================== */
    loadMarket();
    loadMovimientos();
    loadCompras();

});
