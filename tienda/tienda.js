// ---- CONSTANTES ---- //
const LS_USERS = "CITECH_users_v1";
const LS_CURRENT = "CITECH_currentUser_v1";
const LS_CART = "CITECH_cart_v1";

document.addEventListener("DOMContentLoaded", () => {

  const productos = window.CITECH_PRODUCTS;
  const grid = document.querySelector("#grid-products");
  const search = document.querySelector("#search");
  const filterCat = document.querySelector("#filter-category");
  const modal = document.querySelector("#product-modal");
  const modalBody = document.querySelector("#modal-body");
  const loginBtn = document.querySelector("#btn-login");

  // Cargar usuario logueado
  let currentUser = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");

  // Botón login
  loginBtn.onclick = () => {
    window.location.href = "../usuarios/login.xml";
  };

  // Rellenar categorías
  const categorias = [...new Set(productos.map(p => p.categoria))];
  categorias.forEach(c => {
    let opt = document.createElement("option");
    opt.textContent = c;
    opt.value = c;
    filterCat.appendChild(opt);
  });

  // Renderizar productos
  function renderProductos(list = productos) {
    grid.innerHTML = "";

    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="img/${p.imagen}" alt="${p.nombre}">
        <h4>${p.nombre}</h4>
        <p class="desc">${p.descripcion}</p>
        <div class="meta">
          <span class="price">${p.precio.toFixed(2)} €</span>
          <div>
            <button class="view" data-id="${p.id}">Ver</button>
            <button class="add" data-id="${p.id}">Añadir</button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    attachEvents();
  }

  renderProductos();

  // Eventos en las tarjetas
  function attachEvents() {
    document.querySelectorAll(".view").forEach(btn => {
      btn.onclick = () => openModal(btn.dataset.id);
    });

    document.querySelectorAll(".add").forEach(btn => {
      btn.onclick = () => addToCart(btn.dataset.id);
    });
  }

  // Añadir al carrito
  function addToCart(id) {

    // Si no está logueado → enviar al login
    if (!currentUser) {
      alert("Debes iniciar sesión para añadir productos.");
      window.location.href = "../usuarios/login.xml";
      return;
    }

    let cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");
    const prod = productos.find(p => p.id == id);

    let item = cart.find(i => i.id == id);
    if (item) item.qty++;
    else cart.push({ 
      id: prod.id, 
      nombre: prod.nombre, 
      precio: prod.precio, 
      imagen: prod.imagen, 
      qty: 1 
    });

    localStorage.setItem(LS_CART, JSON.stringify(cart));

    alert("Producto añadido al carrito. Puedes gestionarlo desde tu perfil.");
  }

  // Abrir modal
  function openModal(id) {
    const p = productos.find(pr => pr.id == id);
    modalBody.innerHTML = `
      <h2>${p.nombre}</h2>
      <img src="img/${p.imagen}" class="modal-img">
      <p>${p.descripcion}</p>
      <p class="price-large">${p.precio.toFixed(2)} €</p>
      <button class="btn-primary" id="modal-add" data-id="${p.id}">Añadir al carrito</button>
    `;
    modal.classList.add("open");

    document.querySelector(".modal-close").onclick = () =>
      modal.classList.remove("open");

    document.querySelector("#modal-add").onclick = () => addToCart(id);
  }

  // Filtros
  function filter() {
    const q = search.value.toLowerCase();
    const cat = filterCat.value;

    const results = productos.filter(p =>
      p.nombre.toLowerCase().includes(q) &&
      (cat === "" || p.categoria === cat)
    );

    renderProductos(results);
  }

  search.oninput = filter;
  filterCat.onchange = filter;

});
