/* =============================
   CONSTANTES
============================= */

const LS_USERS = "CITECH_users_v1";
const LS_CURRENT = "CITECH_currentUser_v1";
const LS_PRODUCTS = "CITECH_products_v1";
const LS_MARKET = "CITECH_market_v1";
const LS_MOV = "CITECH_movements_v1";
const LS_BUYS = "CITECH_buys_v1";

/* =============================
   CARGA
============================= */

let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
let current = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");

if (!current || current.rol !== "admin") {
    alert("Acceso denegado. No eres administrador.");
    window.location.href = "../perfil/perfil_usuario.xml";
}

let products = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
let market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");
let movements = JSON.parse(localStorage.getItem(LS_MOV) || "[]");
let buys = JSON.parse(localStorage.getItem(LS_BUYS) || "[]");


/* =============================
   NAVEGACIÓN PANELES
============================= */

document.querySelectorAll(".admin-menu button").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
        document.querySelector("#panel-" + btn.dataset.panel).classList.add("active");
    };
});


/* =============================
   USUARIOS
============================= */

function cargarUsuarios() {
    const tbody = document.querySelector("#tabla-usuarios");
    tbody.innerHTML = "";

    users.forEach(u => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${u.usuario}</td>
            <td>${u.email}</td>
            <td>${u.rol}</td>
            <td>
                <button class="btn-role" data-id="${u.id}">
                    Cambiar rol
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    document.querySelectorAll(".btn-role").forEach(btn => {
        btn.onclick = () => cambiarRol(btn.dataset.id);
    });
}

function cambiarRol(id) {
    const u = users.find(x => x.id === id);
    if (!u) return;

    u.rol = u.rol === "admin" ? "user" : "admin";

    localStorage.setItem(LS_USERS, JSON.stringify(users));

    // actualizar current si corresponde
    if (current.id === id) {
        current.rol = u.rol;
        localStorage.setItem(LS_CURRENT, JSON.stringify(current));
    }

    cargarUsuarios();
}


/* =============================
   STOCK TIENDA
============================= */

function cargarStockTienda() {
    const cont = document.querySelector("#stock-tienda");
    cont.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "producto-admin";

        div.innerHTML = `
            <h3>${p.nombre}</h3>
            <p>Stock actual: ${p.stock}</p>
            <input type="number" min="0" value="${p.stock}" class="input-stock">
            <button class="guardar-stock" data-id="${p.id}">
                Guardar
            </button>
        `;

        cont.appendChild(div);
    });

    document.querySelectorAll(".guardar-stock").forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const nuevoStock = Number(btn.parentElement.querySelector(".input-stock").value);

            const prod = products.find(x => x.id == id);
            prod.stock = nuevoStock;

            localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
            alert("Stock actualizado.");
        };
    });
}


/* =============================
   MARKETPLACE
============================= */

function cargarMarketAdmin() {
    const cont = document.querySelector("#lista-market-admin");
    cont.innerHTML = "";

    market.forEach(p => {
        const div = document.createElement("div");
        div.className = "producto-admin";

        div.innerHTML = `
            <img src="${p.imagen}" />
            <h3>${p.nombre}</h3>
            <p>Stock: ${p.stock}</p>
            <input type="number" min="0" value="${p.stock}" class="input-stock">
            <button class="guardar-market" data-id="${p.id}">Guardar</button>
        `;

        cont.appendChild(div);
    });

    document.querySelectorAll(".guardar-market").forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const prod = market.find(m => m.id === id);
            const nuevo = Number(btn.parentElement.querySelector(".input-stock").value);

            prod.stock = nuevo;

            localStorage.setItem(LS_MARKET, JSON.stringify(market));
            alert("Stock actualizado.");
        };
    });
}


/* =============================
   MOVIMIENTOS
============================= */

function cargarMovimientos() {
    const tbody = document.querySelector("#tabla-mov-admin");
    tbody.innerHTML = "";

    movements.forEach(m => {
        const user = users.find(u => u.id === m.usuario);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user ? user.usuario : "Desconocido"}</td>
            <td>${m.tipo}</td>
            <td>${m.monto}€</td>
            <td>${m.descripcion}</td>
            <td>${new Date(m.fecha).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}


/* =============================
   COMPRAS
============================= */

function cargarCompras() {
    const cont = document.querySelector("#compras-admin");
    cont.innerHTML = "";

    buys.forEach(b => {
        const u = users.find(x => x.id == b.usuario);

        const div = document.createElement("div");
        div.className = "producto-admin";

        div.innerHTML = `
            <h3>Compra ID: ${b.id}</h3>
            <p>Usuario: ${u ? u.usuario : "Desconocido"}</p>
            <p>Total: ${b.total}€</p>
            <p>Fecha: ${new Date(b.fecha).toLocaleString()}</p>
        `;

        cont.appendChild(div);
    });
}


/* =============================
   INIT
============================= */

cargarUsuarios();
cargarStockTienda();
cargarMarketAdmin();
cargarMovimientos();
cargarCompras();

