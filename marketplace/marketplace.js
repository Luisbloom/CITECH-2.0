/* ===============================
   CONSTANTES LOCALSTORAGE
   =============================== */

const LS_USERS = "CITECH_users_v1";
const LS_CURRENT = "CITECH_currentUser_v1";
const LS_MARKET = "CITECH_market_v1";
const LS_CART = "CITECH_cart_v1";   // MISMO NOMBRE QUE LA TIENDA

/* ===============================
   CARGA DE DATOS
   =============================== */

let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
let current = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");
let market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");

if (!current) {
    alert("Debe iniciar sesión.");
    window.location.href = "../usuarios/login.xml";
}

/* ===============================
   ELEMENTOS DEL DOM
   =============================== */

const listadoPanel = document.querySelector("#panel-listado");
const publicarPanel = document.querySelector("#panel-publicar");

const lista = document.querySelector("#lista-market");
const filtro = document.querySelector("#filtro-categoria");

const btnIrPublicar = document.querySelector("#btn-ir-publicar");
const btnVolver = document.querySelector("#btn-volver");
const btnPublicar = document.querySelector("#btn-publicar");

/* ===============================
   MOSTRAR PANELES
   =============================== */

btnIrPublicar.onclick = () => {
    listadoPanel.classList.remove("active");
    publicarPanel.classList.add("active");
};

btnVolver.onclick = () => {
    publicarPanel.classList.remove("active");
    listadoPanel.classList.add("active");
};

/* ===============================
   MOSTRAR PRODUCTOS DEL MARKETPLACE
   =============================== */

function cargarMarketplace() {
    lista.innerHTML = "";

    let productos = [...market].reverse();

    if (filtro.value !== "todos") {
        productos = productos.filter(p => p.categoria === filtro.value);
    }

    if (productos.length === 0) {
        lista.innerHTML = "<p>No hay productos para mostrar.</p>";
        return;
    }

    productos.forEach(p => crearCajaProducto(p));
}

function crearCajaProducto(p) {
    const vendedor = users.find(u => u.id === p.vendedor);

    const caja = document.createElement("div");
    caja.className = "producto";

    caja.innerHTML = `
        <img src="${p.imagen}"/>
        <h3>${p.nombre}</h3>
        <p class="precio">${p.precio} €</p>
        <p class="categoria">${p.categoria}</p>
        <p class="vendedor">Vendedor: ${vendedor ? vendedor.usuario : "Desconocido"}</p>
        <button class="btn-comprar">Añadir al carrito</button>
    `;

    caja.querySelector(".btn-comprar").onclick = () => addToCartMarketplace(p);

    lista.appendChild(caja);
}

/* ===============================
   AÑADIR AL CARRITO (MISMA LÓGICA QUE TIENDA)
   =============================== */

function addToCartMarketplace(p) {

    // 1. Leer carrito global
    let cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");

    // 2. Buscar si ya existe
    let item = cart.find(i => i.id == p.id);

    if (item) {
        item.qty++;
    } else {
        cart.push({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio,
            imagen: p.imagen,  // Marketplace usa Base64, la tienda usa img/nombre → ambas válidas
            qty: 1
        });
    }

    // 3. Guardar
    localStorage.setItem(LS_CART, JSON.stringify(cart));

    alert("Producto añadido al carrito. Puedes gestionarlo desde tu perfil.");
}

/* ===============================
   PUBLICAR PRODUCTO
   =============================== */

btnPublicar.onclick = () => {

    const nombre = document.querySelector("#pub-nombre").value.trim();
    const precio = parseFloat(document.querySelector("#pub-precio").value);
    const categoria = document.querySelector("#pub-categoria").value;
    const imagenFile = document.querySelector("#pub-imagen").files[0];

    if (!nombre || !precio || !categoria) {
        alert("Debes completar todos los campos obligatorios.");
        return;
    }

    if (!imagenFile) {
        alert("Debes subir una imagen.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {

        const nuevoProd = {
            id: "mkp_" + Date.now(),
            nombre,
            precio,
            categoria,
            imagen: e.target.result, // BASE64
            vendedor: current.id
        };

        market.push(nuevoProd);
        guardarMarketplace();

        alert("Producto publicado correctamente.");

        publicarPanel.classList.remove("active");
        listadoPanel.classList.add("active");

        cargarMarketplace();
    };

    reader.readAsDataURL(imagenFile);
};

/* ===============================
   GUARDAR LOCALSTORAGE
   =============================== */

function guardarMarketplace() {
    localStorage.setItem(LS_MARKET, JSON.stringify(market));
}

/* ===============================
   EVENTOS
   =============================== */

filtro.onchange = cargarMarketplace;

/* ===============================
   INICIALIZACIÓN
   =============================== */

cargarMarketplace();
