/* perfil_usuario.js
   Gestión de perfil, carrito y movimientos (LocalStorage)
*/

const LS_USERS = "CITECH_users_v1";
const LS_CURRENT = "CITECH_currentUser_v1";
const LS_CART = "CITECH_cart_v1";
const LS_MOV = "CITECH_movements_v1";
const LS_MARKET = "CITECH_market_v1";
const LS_STORE = "CITECH_store_v1";

let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
let currentUser = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");
let cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");
let movements = JSON.parse(localStorage.getItem(LS_MOV) || "[]");
let market = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");
let store = JSON.parse(localStorage.getItem(LS_STORE) || "[]");

if (!currentUser) {
  alert("No has iniciado sesión.");
  window.location.href = "../usuarios/login.xml";
}

/* ---------------------------
   DOM elements
   --------------------------- */
const paneles = document.querySelectorAll(".panel");
const sidebarItems = document.querySelectorAll(".perfil-sidebar li");

const fotoPerfilPreview = document.querySelector("#foto-perfil-preview");
const infoNombre = document.querySelector("#info-nombre");
const infoUsuario = document.querySelector("#info-usuario");
const infoEmail = document.querySelector("#info-email");
const infoTelefono = document.querySelector("#info-telefono");
const infoCalle = document.querySelector("#info-calle");
const infoCiudad = document.querySelector("#info-ciudad");
const infoProvincia = document.querySelector("#info-provincia");
const infoCP = document.querySelector("#info-cp");
const infoNacimiento = document.querySelector("#info-nacimiento");

const adminLink = document.querySelector("#admin-link");

const editNombre = document.querySelector("#edit-nombre");
const editEmail = document.querySelector("#edit-email");
const editTelefono = document.querySelector("#edit-telefono");
const editCalle = document.querySelector("#edit-calle");
const editCiudad = document.querySelector("#edit-ciudad");
const editProvincia = document.querySelector("#edit-provincia");
const editCP = document.querySelector("#edit-cp");
const editNacimiento = document.querySelector("#edit-nacimiento");
const btnGuardarEditar = document.querySelector("#btn-guardar-editar");

const fotoInput = document.querySelector("#foto-input");
const fotoActual = document.querySelector("#foto-actual");
const btnGuardarFoto = document.querySelector("#btn-guardar-foto");

const saldoEl = document.querySelector("#saldo-usuario");
const recargaInput = document.querySelector("#cantidad-recarga");
const btnRecargar = document.querySelector("#btn-recargar");

const carritoLista = document.querySelector("#carrito-lista");
const carritoTotal = document.querySelector("#carrito-total");
const btnComprar = document.querySelector("#btn-comprar");

const tablaMovBody = document.querySelector("#tabla-mov-body");

const btnHacerAdmin = document.querySelector("#btn-hacer-admin");
const btnLogout = document.querySelector("#btn-logout");

/* ---------------------------
   Panel selection
   --------------------------- */
sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    sidebarItems.forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");
    const panelID = item.dataset.panel;
    paneles.forEach(p => p.classList.remove("active"));
    const target = document.querySelector("#panel-" + panelID);
    if (target) target.classList.add("active");
  });
});

/* ---------------------------
   Show admin link if admin
   --------------------------- */
if (currentUser.rol === "admin" && adminLink) adminLink.style.display = "inline-block";

/* ---------------------------
   Load / Save helpers
   --------------------------- */
function guardarUsuario() {
  users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx === -1) users.push(currentUser);
  else users[idx] = currentUser;
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  localStorage.setItem(LS_CURRENT, JSON.stringify(currentUser));
}

function pushMovimiento(tipo, monto, descripcion, origen = "tienda", producto = null, qty = null, precioUnitario = null, vendedor = null) {
  let movs = JSON.parse(localStorage.getItem(LS_MOV) || "[]");
  const mov = {
    id: "mov_" + Date.now() + "_" + Math.floor(Math.random() * 9999),
    usuario: currentUser.id,
    usuarioNombre: currentUser.usuario,
    usuarioEmail: currentUser.email,
    tipo,                // compra_tienda | compra_market | recarga | tienda_add | tienda_stock | tienda_delete
    monto,
    descripcion,
    origen,              // "marketplace" | "tienda" | "saldo"
    producto,
    qty,
    precioUnitario,
    vendedor,
    fecha: new Date().toISOString()
  };
  movs.push(mov);
  localStorage.setItem(LS_MOV, JSON.stringify(movs));
}

/* ---------------------------
   Load profile info
   --------------------------- */
function cargarInfo() {
  fotoPerfilPreview.src = currentUser.foto || "../img/default_user.png";
  infoNombre.textContent = currentUser.nombre || "";
  infoUsuario.textContent = currentUser.usuario || "";
  infoEmail.textContent = currentUser.email || "";
  infoTelefono.textContent = currentUser.telefono || "";
  infoCalle.textContent = currentUser.direccion?.calle || "";
  infoCiudad.textContent = currentUser.direccion?.ciudad || "";
  infoProvincia.textContent = currentUser.direccion?.provincia || "";
  infoCP.textContent = currentUser.direccion?.cp || "";
  infoNacimiento.textContent = currentUser.nacimiento || "";
}

/* ---------------------------
   Edit profile
   --------------------------- */
function cargarEditar() {
  editNombre.value = currentUser.nombre || "";
  editEmail.value = currentUser.email || "";
  editTelefono.value = currentUser.telefono || "";
  editCalle.value = currentUser.direccion?.calle || "";
  editCiudad.value = currentUser.direccion?.ciudad || "";
  editProvincia.value = currentUser.direccion?.provincia || "";
  editCP.value = currentUser.direccion?.cp || "";
  editNacimiento.value = currentUser.nacimiento || "";
}

if (btnGuardarEditar) {
  btnGuardarEditar.onclick = () => {
    currentUser.nombre = editNombre.value;
    currentUser.email = editEmail.value;
    currentUser.telefono = editTelefono.value;
    currentUser.direccion = currentUser.direccion || {};
    currentUser.direccion.calle = editCalle.value;
    currentUser.direccion.ciudad = editCiudad.value;
    currentUser.direccion.provincia = editProvincia.value;
    currentUser.direccion.cp = editCP.value;
    currentUser.nacimiento = editNacimiento.value;
    guardarUsuario();
    cargarInfo();
    alert("Datos actualizados correctamente.");
  };
}

/* ---------------------------
   Profile photo
   --------------------------- */
if (fotoInput) {
  fotoInput.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => { fotoActual.src = reader.result; };
    reader.readAsDataURL(file);
  };
}
if (btnGuardarFoto) btnGuardarFoto.onclick = () => {
  currentUser.foto = fotoActual.src;
  guardarUsuario();
  cargarInfo();
  alert("Foto actualizada.");
};

/* ---------------------------
   Balance / Recharge
   --------------------------- */
function cargarSaldo() {
  saldoEl.textContent = ((currentUser.saldo || 0)).toFixed(2) + "€";
}
if (btnRecargar) {
  btnRecargar.onclick = () => {
    const cant = Number(recargaInput.value);
    if (cant <= 0) return alert("Introduce cantidad válida.");
    currentUser.saldo = (currentUser.saldo || 0) + cant;
    guardarUsuario();
    cargarSaldo();
    pushMovimiento("recarga", cant, `Recarga de ${cant}€`, "saldo", null, 1, cant);
    recargaInput.value = "";
    alert("Recarga realizada y registrada.");
  };
}

/* ---------------------------
   Cart rendering & utilities
   --------------------------- */
function cargarCarrito() {
  carritoLista.innerHTML = "";
  cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");
  if (!cart.length) { carritoLista.innerHTML = "<p>Carrito vacío.</p>"; carritoTotal.textContent = "0€"; return; }
  let total = 0;
  cart.forEach(item => {
    total += item.precio * item.qty;
    const box = document.createElement("div"); box.className = "carrito-item";
    const imgSrc = item.origen === "marketplace" ? item.imagen : "../img/" + item.imagen;
    box.innerHTML = `<img src="${imgSrc}"><div class="info"><h4>${item.nombre}</h4><p>${item.precio}€ x ${item.qty}</p></div>`;
    carritoLista.appendChild(box);
  });
  carritoTotal.textContent = total.toFixed(2) + "€";
}

/* ---------------------------
   Buy: records individual movements
   --------------------------- */
if (btnComprar) {
  btnComprar.onclick = () => {
    cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");
    if (!cart.length) return alert("Carrito vacío.");
    let total = cart.reduce((t, p) => t + p.precio * p.qty, 0);
    if ((currentUser.saldo || 0) < total) return alert("No tienes saldo suficiente.");
    // charge user
    currentUser.saldo = (currentUser.saldo || 0) - total;
    guardarUsuario(); cargarSaldo();
    // per-item processing
    cart.forEach(item => {
      const origen = item.origen === "marketplace" ? "marketplace" : "tienda";
      const tipoMov = origen === "marketplace" ? "compra_market" : "compra_tienda";
      const descripcion = `${item.nombre} — ${item.precio}€ x ${item.qty} — Origen: ${origen}`;
      // movement per item
      pushMovimiento(tipoMov, -(item.precio * item.qty), descripcion, origen, item.nombre, item.qty, item.precio, item.vendedor || null);
      // if marketplace reduce stock
      if (origen === "marketplace") {
        let marketLocal = JSON.parse(localStorage.getItem(LS_MARKET) || "[]");
        let prod = marketLocal.find(p => p.id === item.id);
        if (prod) {
          prod.stock = Math.max(0, (prod.stock || 0) - item.qty);
          // Don't remove product, keep it with stock 0
          localStorage.setItem(LS_MARKET, JSON.stringify(marketLocal));
        }
      } else {
        // if store item, reduce store stock if present
        let storeLocal = JSON.parse(localStorage.getItem(LS_STORE) || "[]");
        let prodS = storeLocal.find(s => s.id === item.id);
        if (prodS) {
          prodS.stock = Math.max(0, (prodS.stock || 0) - item.qty);
          // Don't remove product, keep it with stock 0
          localStorage.setItem(LS_STORE, JSON.stringify(storeLocal));
        }
      }
    });
    // clear cart
    cart = []; localStorage.setItem(LS_CART, "[]"); cargarCarrito();
    // reload movements shown
    cargarMovimientos();
    alert("Compra realizada. Movimientos registrados.");
  };
}

/* ---------------------------
   Show movements for current user
   --------------------------- */
function cargarMovimientos() {
  tablaMovBody.innerHTML = "";
  movements = JSON.parse(localStorage.getItem(LS_MOV) || "[]");
  const movs = movements.filter(m => m.usuario === currentUser.id).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  movs.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(m.fecha).toLocaleString()}</td>
      <td>${m.tipo}</td>
      <td>${m.origen || "-"}</td>
      <td>${m.producto || "-"}</td>
      <td>${m.qty || "-"}</td>
      <td>${m.precioUnitario ? m.precioUnitario + "€" : "-"}</td>
      <td>${Number(m.monto).toFixed(2)}€</td>
      <td>${m.descripcion || "-"}</td>
    `;
    tablaMovBody.appendChild(tr);
  });
}

/* ---------------------------
   Make admin (profile)
   --------------------------- */
if (btnHacerAdmin) {
  btnHacerAdmin.onclick = () => {
    if (currentUser.rol === "admin") return alert("Ya eres administrador.");
    if (!confirm("¿Seguro que quieres convertirte en administrador?")) return;
    currentUser.rol = "admin"; guardarUsuario(); alert("Ahora eres administrador."); location.reload();
  };
}

/* ---------------------------
   Logout
   --------------------------- */
if (btnLogout) {
  btnLogout.onclick = () => { localStorage.removeItem(LS_CURRENT); window.location.href = "../index/index.xml"; };
}

/* ---------------------------
   Init
   --------------------------- */
cargarInfo(); cargarEditar(); cargarSaldo(); cargarCarrito(); cargarMovimientos();
