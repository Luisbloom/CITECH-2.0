/* ===============================
   CONSTANTES LOCALSTORAGE
   =============================== */

const LS_USERS = "CITECH_users_v1";
const LS_CURRENT = "CITECH_currentUser_v1";
const LS_CART = "CITECH_cart_v1";
const LS_MOV = "CITECH_movements_v1";

/* ===============================
   CARGA DE DATOS
   =============================== */

let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
let currentUser = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");
let cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");
let movements = JSON.parse(localStorage.getItem(LS_MOV) || "[]");

if (!currentUser) {
  alert("No has iniciado sesión.");
  window.location.href = "../usuarios/login.xml";
}

/* ===============================
   DOM ELEMENTOS
   =============================== */

const paneles = document.querySelectorAll(".panel");
const sidebarItems = document.querySelectorAll(".perfil-sidebar li");

// Información
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

// Admin link
const adminLink = document.querySelector("#admin-link");

// Editar perfil
const editNombre = document.querySelector("#edit-nombre");
const editEmail = document.querySelector("#edit-email");
const editTelefono = document.querySelector("#edit-telefono");
const editCalle = document.querySelector("#edit-calle");
const editCiudad = document.querySelector("#edit-ciudad");
const editProvincia = document.querySelector("#edit-provincia");
const editCP = document.querySelector("#edit-cp");
const editNacimiento = document.querySelector("#edit-nacimiento");
const btnGuardarEditar = document.querySelector("#btn-guardar-editar");

// Contraseña
const passActual = document.querySelector("#pass-actual");
const passNueva = document.querySelector("#pass-nueva");
const passConfirm = document.querySelector("#pass-confirm");
const btnCambiarPass = document.querySelector("#btn-cambiar-pass");

// Foto
const fotoInput = document.querySelector("#foto-input");
const fotoActual = document.querySelector("#foto-actual");
const btnGuardarFoto = document.querySelector("#btn-guardar-foto");

// Saldo
const saldoEl = document.querySelector("#saldo-usuario");
const recargaInput = document.querySelector("#cantidad-recarga");
const btnRecargar = document.querySelector("#btn-recargar");

// Carrito
const carritoLista = document.querySelector("#carrito-lista");
const carritoTotal = document.querySelector("#carrito-total");
const btnComprar = document.querySelector("#btn-comprar");

// Movimientos
const tablaMovBody = document.querySelector("#tabla-mov-body");

// Admin Upgrade
const btnHacerAdmin = document.querySelector("#btn-hacer-admin");

// Logout
const btnLogout = document.querySelector("#btn-logout");


/* ===============================
   PANEL SELECCIONADO
   =============================== */

sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    sidebarItems.forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");

    const panelID = item.dataset.panel;
    paneles.forEach(p => p.classList.remove("active"));
    document.querySelector("#panel-" + panelID).classList.add("active");
  });
});


/* ===============================
   MOSTRAR LINK ADMIN
   =============================== */

if (currentUser.rol === "admin") {
    adminLink.style.display = "inline-block";
}


/* ===============================
   CARGAR INFORMACIÓN
   =============================== */

function cargarInfo() {
  fotoPerfilPreview.src = currentUser.foto || "../img/default_user.png";
  infoNombre.textContent = currentUser.nombre;
  infoUsuario.textContent = currentUser.usuario;
  infoEmail.textContent = currentUser.email;
  infoTelefono.textContent = currentUser.telefono;
  infoCalle.textContent = currentUser.direccion.calle;
  infoCiudad.textContent = currentUser.direccion.ciudad;
  infoProvincia.textContent = currentUser.direccion.provincia;
  infoCP.textContent = currentUser.direccion.cp;
  infoNacimiento.textContent = currentUser.nacimiento;
}


/* ===============================
   EDITAR PERFIL
   =============================== */

function cargarEditar() {
  editNombre.value = currentUser.nombre;
  editEmail.value = currentUser.email;
  editTelefono.value = currentUser.telefono;
  editCalle.value = currentUser.direccion.calle;
  editCiudad.value = currentUser.direccion.ciudad;
  editProvincia.value = currentUser.direccion.provincia;
  editCP.value = currentUser.direccion.cp;
  editNacimiento.value = currentUser.nacimiento;
}

btnGuardarEditar.onclick = () => {
  currentUser.nombre = editNombre.value;
  currentUser.email = editEmail.value;
  currentUser.telefono = editTelefono.value;
  currentUser.direccion.calle = editCalle.value;
  currentUser.direccion.ciudad = editCiudad.value;
  currentUser.direccion.provincia = editProvincia.value;
  currentUser.direccion.cp = editCP.value;
  currentUser.nacimiento = editNacimiento.value;

  guardarUsuario();
  cargarInfo();

  alert("Datos actualizados correctamente.");
};


/* ===============================
   CAMBIAR CONTRASEÑA
   =============================== */

btnCambiarPass.onclick = () => {
  if (passActual.value !== currentUser.password)
    return alert("La contraseña actual no es correcta.");

  if (passNueva.value !== passConfirm.value)
    return alert("Las contraseñas no coinciden.");

  currentUser.password = passNueva.value;
  guardarUsuario();

  passActual.value = "";
  passNueva.value = "";
  passConfirm.value = "";

  alert("Contraseña actualizada.");
};


/* ===============================
   FOTO DE PERFIL
   =============================== */

fotoInput.onchange = e => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    fotoActual.src = reader.result;
  };

  reader.readAsDataURL(file);
};

btnGuardarFoto.onclick = () => {
  currentUser.foto = fotoActual.src;
  guardarUsuario();
  cargarInfo();
  alert("Foto actualizada.");
};


/* ===============================
   SALDO
   =============================== */

function cargarSaldo() {
  saldoEl.textContent = currentUser.saldo.toFixed(2) + "€";
}

btnRecargar.onclick = () => {
  const cant = Number(recargaInput.value);
  if (cant <= 0) return alert("Introduce cantidad válida.");
  
  currentUser.saldo += cant;
  movimientosPush("recarga", cant, "Recarga de saldo");

  guardarUsuario();
  cargarSaldo();
  recargaInput.value = "";
  alert("Recarga realizada.");
};


/* ===============================
   CARRITO
   =============================== */

function cargarCarrito() {
  carritoLista.innerHTML = "";

  if (!cart.length) {
    carritoLista.innerHTML = "<p>Carrito vacío.</p>";
    carritoTotal.textContent = "0€";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.precio * item.qty;

    const box = document.createElement("div");
    box.className = "carrito-item";

    const imgSrc = item.origen === "marketplace"
        ? item.imagen
        : "../tienda/img/" + item.imagen;

    box.innerHTML = `
      <img src="${imgSrc}">
      <div class="info">
        <h4>${item.nombre}</h4>
        <p>${item.precio}€ x ${item.qty}</p>
      </div>
    `;

    carritoLista.appendChild(box);
  });

  carritoTotal.textContent = total.toFixed(2) + "€";
}

btnComprar.onclick = () => {
  const total = cart.reduce((t, i) => t + i.precio * i.qty, 0);

  if (currentUser.saldo < total)
    return alert("No tienes saldo suficiente.");

  currentUser.saldo -= total;
  movimientosPush("compra", -total, "Compra realizada");

  guardarUsuario();
  cargarSaldo();

  cart = [];
  localStorage.setItem(LS_CART, JSON.stringify(cart));
  cargarCarrito();

  alert("Compra realizada con éxito.");
};


/* ===============================
   MOVIMIENTOS
   =============================== */

function cargarMovimientos() {
  tablaMovBody.innerHTML = "";

  const mov = movements.filter(m => m.usuario === currentUser.id);

  mov.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(m.fecha).toLocaleString()}</td>
      <td>${m.tipo}</td>
      <td>${m.monto}€</td>
      <td>${m.descripcion}</td>
    `;
    tablaMovBody.appendChild(tr);
  });
}

function movimientosPush(tipo, monto, desc) {
  const mov = {
    id: "mov_" + Date.now(),
    usuario: currentUser.id,
    tipo,
    monto,
    descripcion: desc,
    fecha: new Date().toISOString()
  };

  movements.push(mov);
  localStorage.setItem(LS_MOV, JSON.stringify(movements));
}


/* ===============================
   HACERSE ADMIN
   =============================== */

if (btnHacerAdmin) {
    btnHacerAdmin.onclick = () => {
        if (currentUser.rol === "admin") {
            return alert("Ya eres administrador.");
        }

        if (!confirm("¿Seguro que quieres convertirte en administrador?")) return;

        currentUser.rol = "admin";
        guardarUsuario();

        alert("Ahora eres administrador.");
        location.reload();
    };
}


/* ===============================
   GUARDAR USUARIO
   =============================== */

function guardarUsuario() {
  const index = users.findIndex(u => u.id === currentUser.id);
  users[index] = currentUser;

  localStorage.setItem(LS_USERS, JSON.stringify(users));
  localStorage.setItem(LS_CURRENT, JSON.stringify(currentUser));
}


/* ===============================
   LOGOUT
   =============================== */

btnLogout.onclick = () => {
  localStorage.removeItem(LS_CURRENT);
  window.location.href = "../index/index.xml";
};


/* ===============================
   INICIALIZACIÓN
   =============================== */

cargarInfo();
cargarEditar();
cargarSaldo();
cargarCarrito();
cargarMovimientos();
