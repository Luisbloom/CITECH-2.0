/* ===============================
   CONSTANTES LOCALSTORAGE
   =============================== */

const LS_USERS = "CITECH_users_v1";
const LS_CURRENT = "CITECH_currentUser_v1";
const LS_MARKET = "CITECH_market_v1";
const LS_CART = "CITECH_cart_v1";
const LS_MOV = "CITECH_movements_v1";
const LS_BUYS = "CITECH_buys_v1";

/* ===============================
   CARGA DE DATOS
   =============================== */

let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
let current = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");
let market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");
let cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");

if (!current) {
    alert("Debes iniciar sesión.");
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

const pubNombre = document.querySelector("#pub-nombre");
const pubPrecio = document.querySelector("#pub-precio");
const pubCategoria = document.querySelector("#pub-categoria");
const pubStock = document.querySelector("#pub-stock");
const pubImagen = document.querySelector("#pub-imagen");

/* ===============================
   UTIL: resolver ruta de imagen
   =============================== */
function resolveImageSrc(imagen) {
    if (!imagen) return "../img/noimage.png";
    if (imagen.startsWith("data:")) return imagen;
    if (imagen.startsWith("http") || imagen.startsWith("../")) return imagen;
    return "../tienda/img/" + imagen;
}

/* ===============================
   PANELES
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
   PUBLICAR PRODUCTO
   =============================== */

btnPublicar.onclick = () => {

    const nombre = pubNombre.value.trim();
    const precio = parseFloat(pubPrecio.value);
    const categoria = pubCategoria.value;
    const stock = parseInt(pubStock.value, 10);
    const imagenFile = pubImagen.files[0];

    if (!nombre || !precio || !categoria || !stock || stock < 1) {
        alert("Completa todos los campos.");
        return;
    }

    if (imagenFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            createMarketProduct(nombre, precio, categoria, stock, e.target.result);
        };
        reader.readAsDataURL(imagenFile);
    } else {
        createMarketProduct(nombre, precio, categoria, stock, "../img/noimage.png");
    }
};

function createMarketProduct(nombre, precio, categoria, stock, imagenData) {

    const nuevo = {
        id: "mkp_" + Date.now(),
        nombre,
        precio: Number(precio),
        categoria,
        imagen: imagenData,
        stock: Number(stock),
        vendedor: current.id,
        fecha: new Date().toISOString()
    };

    market.push(nuevo);
    localStorage.setItem(LS_MARKET, JSON.stringify(market));

    alert("Producto publicado.");

    pubNombre.value = "";
    pubPrecio.value = "";
    pubStock.value = "1";
    pubCategoria.value = "componentes";
    pubImagen.value = "";

    publicarPanel.classList.remove("active");
    listadoPanel.classList.add("active");
    cargarMarketplace();
}

/* ===============================
   CARGAR MARKETPLACE
   =============================== */

function cargarMarketplace() {

    market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");
    users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

    lista.innerHTML = "";

    let productos = [...market].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (filtro.value !== "todos") {
        productos = productos.filter(p => p.categoria === filtro.value);
    }

    if (!productos.length) {
        lista.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
    }

    productos.forEach(p => {

        const card = document.createElement("div");
        card.className = "producto";

        const vendedor = users.find(u => u.id === p.vendedor);
        const vendedorNombre = vendedor ? vendedor.usuario : "Usuario";

        card.innerHTML = `
            <img src="${resolveImageSrc(p.imagen)}">
            <h3>${p.nombre}</h3>
            <p class="precio">${p.precio.toFixed(2)} €</p>
            <p class="categoria">${p.categoria}</p>
            <p class="vendedor">Vendedor: ${vendedorNombre}</p>
            <p class="stock">Stock: <strong>${p.stock}</strong></p>

            <div class="add-zone">
                <input type="number" min="1" value="1" class="qty-input">
                <button class="btn-comprar">Añadir al carrito</button>
            </div>
        `;

        if (p.stock <= 0) {
            const btn = card.querySelector(".btn-comprar");
            btn.disabled = true;
            btn.textContent = "Agotado";
            btn.style.opacity = "0.6";
        } else {
            card.querySelector(".btn-comprar").onclick = () => {
                const qty = parseInt(card.querySelector(".qty-input").value, 10);
                addToCartMarketplace(p.id, qty);
            }
        }

        lista.appendChild(card);
    });
}

/* ===============================
   AÑADIR AL CARRITO
   =============================== */

function addToCartMarketplace(productId, quantity) {

    market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");

    const prod = market.find(p => p.id === productId);
    if (!prod) {
        alert("Este producto ya no está disponible.");
        cargarMarketplace();
        return;
    }

    cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");

    const existing = cart.find(i => i.id === productId);
    const alreadyQty = existing ? existing.qty : 0;
    const totalWanted = alreadyQty + quantity;

    if (totalWanted > prod.stock) {
        alert("No hay stock suficiente.");
        return;
    }

    if (existing) {
        existing.qty = totalWanted;
    } else {
        cart.push({
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            imagen: prod.imagen,
            qty: quantity,
            origen: "marketplace",
            vendedor: prod.vendedor
        });
    }

    localStorage.setItem(LS_CART, JSON.stringify(cart));
    alert("Añadido al carrito.");
}

/* ===============================
   EVENTOS
   =============================== */

filtro.onchange = cargarMarketplace;

// inicializar
cargarMarketplace();
