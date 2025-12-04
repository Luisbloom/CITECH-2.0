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

    // Helper to resolve image source
    function resolveImageSrc(img) {
        if (!img) return "../img/default_product.png";
        if (img.startsWith("http") || img.startsWith("data:")) return img;
        // Always use relative path to project img folder
        return "../img/" + img;
    }

    // --- Render ---
    function render(list = productos) {
        grid.innerHTML = "";
        list.forEach(p => {
            const stock = p.stock || 0;
            const stockClass = stock > 10 ? 'stock-good' : stock > 0 ? 'stock-low' : 'stock-out';
            const stockText = stock > 0 ? `${stock} disponibles` : '0 disponibles (Agotado)';
            const imgSrc = resolveImageSrc(p.imagen);

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${imgSrc}">
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
        const stockText = stock > 0 ? `✓ Stock disponible: ${stock} unidades` : '✗ Producto agotado (0 unidades)';
        const imgSrc = resolveImageSrc(p.imagen);

        // Stock icon
        const stockIcon = stock > 10 ? '✓' : stock > 0 ? '⚠' : '✗';

        modalBody.innerHTML = `
            <button class="modal-close" aria-label="Cerrar">✕</button>
            
            <div class="modal-header">
                <h2>${p.nombre}</h2>
                <span class="modal-category-badge">📦 ${p.categoria}</span>
            </div>
            
            <div class="modal-body-grid">
                <div class="modal-img-container">
                    <div class="modal-product-id">ID: #${p.id}</div>
                    <img src="${imgSrc}" class="modal-img" alt="${p.nombre}">
                </div>
                
                <div class="modal-info">
                    <div>
                        <div class="modal-description">
                            ${p.descripcion}
                        </div>
                        
                        <div class="stock-info ${stockClass}">
                            ${stockIcon} ${stockText}
                        </div>
                    </div>
                    
                    <div>
                        <div class="modal-price-section">
                            <div class="price-label">Precio</div>
                            <div class="price-large">${p.precio.toFixed(2)} €</div>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn-primary" id="modal-add" data-id="${p.id}" ${stock <= 0 ? 'disabled' : ''}>
                                ${stock <= 0 ? '🔒 No disponible' : '🛒 Añadir al carrito'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.classList.add("open");

        document.querySelector(".modal-close").onclick = () =>
            modal.classList.remove("open");

        const modalAddBtn = document.querySelector("#modal-add");
        if (modalAddBtn) {
            modalAddBtn.onclick = () => addToCart(id);
        }
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
