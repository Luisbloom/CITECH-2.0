const LS_CURRENT = "CITECH_currentUser_v1";
const LS_CART = "CITECH_cart_v1";
const LS_STORE = "CITECH_store_v1";
const LS_DEL = "CITECH_deleted_xml_products_v1";

document.addEventListener("DOMContentLoaded", () => {

    // --- XML + LS MERGE ---
    const xmlProducts = window.XML_PRODUCTS;
    const storeProducts = JSON.parse(localStorage.getItem(LS_STORE) || "[]");
    const deletedXml = JSON.parse(localStorage.getItem(LS_DEL) || "[]");

    function getAllProducts() {
        let base = xmlProducts.filter(p => !deletedXml.includes(p.id));
        storeProducts.forEach(p => {
            let i = base.findIndex(x => x.id === p.id);
            if (i >= 0) base[i] = p;
            else base.push(p);
        });
        return base;
    }

    let productos = getAllProducts();

    // ---- UI ELEMENTOS ----
    const grid = document.querySelector("#grid-products");
    const search = document.querySelector("#search");
    const filterCat = document.querySelector("#filter-category");
    const modal = document.querySelector("#product-modal");
    const modalBody = document.querySelector("#modal-body");

    let currentUser = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");

    // --- Categorías ---
    [...new Set(productos.map(p => p.categoria))].forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        filterCat.appendChild(opt);
    });

    // --- Render ---
    function render(list = productos) {
        grid.innerHTML = "";
        list.forEach(p => {
            const stock = p.stock || 0;
            const stockClass = stock > 10 ? 'stock-good' : stock > 0 ? 'stock-low' : 'stock-out';
            const stockText = stock > 0 ? `${stock} disponibles` : 'Agotado';

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="../img/${p.imagen}">
                <h4>${p.nombre}</h4>
                <p class="desc">${p.descripcion}</p>
                <div class="stock-badge ${stockClass}">${stockText}</div>
                <div class="meta">
                    <span>${p.precio.toFixed(2)}€</span>
                    <button class="view" data-id="${p.id}">Ver</button>
                    <button class="add" data-id="${p.id}" ${stock <= 0 ? 'disabled' : ''}>Añadir</button>
                </div>
            `;
            grid.appendChild(card);
        });
        attachEvents();
    }
    render();

    function attachEvents() {
        document.querySelectorAll(".view").forEach(btn => {
            btn.onclick = () => openModal(btn.dataset.id);
        });

        document.querySelectorAll(".add").forEach(btn => {
            btn.onclick = () => addToCart(btn.dataset.id);
        });
    }

    // --- Carrito ---
    function addToCart(id) {
        if (!currentUser) {
            alert("Debes iniciar sesión.");
            window.location.href = "../usuarios/login.xml";
            return;
        }

        let cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");
        const prod = productos.find(p => p.id == id);

        // Check stock availability
        const productStock = prod.stock || 0;
        const currentQtyInCart = cart.find(i => i.id == id)?.qty || 0;

        if (productStock <= 0) {
            alert("⚠️ Lo sentimos, este producto está agotado.\n\nNo hay stock disponible en este momento.");
            return;
        }

        if (currentQtyInCart >= productStock) {
            alert(`⚠️ Stock insuficiente\n\nYa tienes ${currentQtyInCart} unidad(es) en el carrito.\nStock disponible: ${productStock} unidad(es).`);
            return;
        }

        let ex = cart.find(i => i.id == id);
        if (ex) ex.qty++;
        else cart.push({ ...prod, qty: 1 });

        localStorage.setItem(LS_CART, JSON.stringify(cart));

        const remaining = productStock - (currentQtyInCart + 1);
        if (remaining > 0) {
            alert(`✅ Producto añadido al carrito.\n\nStock restante: ${remaining} unidad(es).`);
        } else {
            alert("✅ Producto añadido al carrito.\n\n⚠️ Has alcanzado el stock máximo disponible.");
        }
    }

    // --- Modal ---
    function openModal(id) {
        const p = productos.find(x => x.id == id);
        const stock = p.stock || 0;
        const stockClass = stock > 10 ? 'stock-good' : stock > 0 ? 'stock-low' : 'stock-out';
        const stockText = stock > 0 ? `Stock disponible: ${stock} unidades` : '❌ Producto agotado';

        modalBody.innerHTML = `
            <h2>${p.nombre}</h2>
            <img src="../img/${p.imagen}" class="modal-img">
            <p>${p.descripcion}</p>
            <p class="price-large">${p.precio.toFixed(2)} €</p>
            <div class="stock-info ${stockClass}">${stockText}</div>
            <button class="btn-primary" id="modal-add" data-id="${p.id}" ${stock <= 0 ? 'disabled' : ''}>Añadir al carrito</button>
        `;
        modal.classList.add("open");

        document.querySelector(".modal-close").onclick = () =>
            modal.classList.remove("open");

        document.querySelector("#modal-add").onclick = () =>
            addToCart(id);
    }

    // --- Filtros ---
    function filter() {
        const q = search.value.toLowerCase();
        const cat = filterCat.value;

        const res = productos.filter(p =>
            p.nombre.toLowerCase().includes(q) &&
            (cat === "" || p.categoria === cat)
        );

        render(res);
    }

    search.oninput = filter;
    filterCat.onchange = filter;
});
