const LS_CURRENT = "CITECH_currentUser_v1";
const LS_CART = "CITECH_cart_v1";
const LS_STORE = "CITECH_store_v1";
const LS_DEL = "CITECH_deleted_xml_products_v1";

document.addEventListener("DOMContentLoaded", () => {

    // --- XML + LS MERGE ---
    const xmlProducts = window.XML_PRODUCTS || [];
    const storeProducts = JSON.parse(localStorage.getItem(LS_STORE) || "[]");
    const deletedXml = JSON.parse(localStorage.getItem(LS_DEL) || "[]");

    if (!window.XML_PRODUCTS) {
        console.error("ERROR: No se pudieron cargar los productos del XML. Verifica que productos.xml sea válido.");
    }

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
    const categoryFiltersContainer = document.querySelector("#category-filters");
    const priceRange = document.querySelector("#price-range");
    const priceValue = document.querySelector("#price-value");
    const stockAvailable = document.querySelector("#stock-available");
    const stockLow = document.querySelector("#stock-low");
    const stockOut = document.querySelector("#stock-out");
    const resetFiltersBtn = document.querySelector("#reset-filters");
    const modal = document.querySelector("#product-modal");
    const modalBody = document.querySelector("#modal-body");
    const modalBackdrop = document.querySelector(".modal-backdrop");

    // Event listener for static close button
    const closeBtn = document.querySelector(".modal-close");
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove("open");
    }

    // Close modal on backdrop click
    if (modalBackdrop) {
        modalBackdrop.onclick = () => modal.classList.remove("open");
    }

    // Close modal on ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            modal.classList.remove("open");
        }
    });

    let currentUser = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");
    let selectedCategory = "";

    // --- Categorías en Sidebar ---
    const categories = [...new Set(productos.map(p => p.categoria))];

    // Botón "Todas"
    const allBtn = document.createElement("button");
    allBtn.className = "category-filter-btn active";
    allBtn.textContent = "▤ Todas las categorías";
    allBtn.onclick = () => {
        selectedCategory = "";
        updateCategoryButtons();
        filter();
    };
    categoryFiltersContainer.appendChild(allBtn);

    // Botones de categorías
    categories.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "category-filter-btn";
        btn.textContent = c;
        btn.dataset.category = c;
        btn.onclick = () => {
            selectedCategory = c;
            updateCategoryButtons();
            filter();
        };
        categoryFiltersContainer.appendChild(btn);
    });

    function updateCategoryButtons() {
        document.querySelectorAll(".category-filter-btn").forEach(btn => {
            if (btn.dataset.category === selectedCategory || (!selectedCategory && btn.textContent.includes("Todas"))) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    // --- Price Range ---
    if (priceRange && priceValue) {
        priceRange.oninput = () => {
            priceValue.textContent = priceRange.value + "€";
            filter();
        };
    }

    // --- Stock Filters ---
    if (stockAvailable) stockAvailable.onchange = filter;
    if (stockLow) stockLow.onchange = filter;
    if (stockOut) stockOut.onchange = filter;

    // --- Reset Filters ---
    if (resetFiltersBtn) {
        resetFiltersBtn.onclick = () => {
            selectedCategory = "";
            if (search) search.value = "";
            if (priceRange) {
                priceRange.value = 10000;
                priceValue.textContent = "10000€";
            }
            if (stockAvailable) stockAvailable.checked = true;
            if (stockLow) stockLow.checked = true;
            if (stockOut) stockOut.checked = false;
            updateCategoryButtons();
            filter();
        };
    }

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

        // Update product count
        const countElement = document.querySelector("#product-count");
        if (countElement) {
            countElement.textContent = list.length;
        }

        list.forEach(p => {
            const stock = p.stock || 0;
            const stockClass = stock > 10 ? 'stock-good' : stock > 0 ? 'stock-low' : 'stock-out';
            const stockText = stock > 10 ? `✓ ${stock} en stock` : stock > 0 ? `⚠ Solo ${stock}` : '✕ Agotado';
            const imgSrc = resolveImageSrc(p.imagen);

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${imgSrc}" alt="${p.nombre}">
                    <div class="card-badge">${p.categoria}</div>
                    <div class="stock-badge ${stockClass}">${stockText}</div>
                </div>
                <div class="card-content">
                    <h4>${p.nombre}</h4>
                    <p class="desc">${p.descripcion}</p>
                    <div class="card-footer">
                        <span class="price">${p.precio.toFixed(2)}€</span>
                        <div class="card-actions">
                            <button class="view" data-id="${p.id}">◉ Ver</button>
                            <button class="add" data-id="${p.id}" ${stock <= 0 ? 'disabled' : ''}>
                                ${stock <= 0 ? '✕' : '+'}
                            </button>
                        </div>
                    </div>
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
        const stockText = stock > 0 ? `✓ Stock disponible: ${stock} unidades` : '✕ Producto agotado (0 unidades)';
        const imgSrc = resolveImageSrc(p.imagen);

        // Stock icon
        const stockIcon = stock > 10 ? '✓' : stock > 0 ? '⚠' : '✗';

        modalBody.innerHTML = `
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
                                ${stock <= 0 ? '✕ No disponible' : '+ Añadir al carrito'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.classList.add("open");

        const modalAddBtn = document.querySelector("#modal-add");
        if (modalAddBtn) {
            modalAddBtn.onclick = () => addToCart(id);
        }
    }


    // --- Filtros ---
    function filter() {
        const q = search ? search.value.toLowerCase() : "";
        const maxPrice = priceRange ? parseInt(priceRange.value) : 10000;
        const showAvailable = stockAvailable ? stockAvailable.checked : true;
        const showLow = stockLow ? stockLow.checked : true;
        const showOut = stockOut ? stockOut.checked : false;

        const res = productos.filter(p => {
            // Búsqueda por texto
            const matchesSearch = p.nombre.toLowerCase().includes(q) ||
                p.descripcion.toLowerCase().includes(q);

            // Filtro por categoría
            const matchesCategory = selectedCategory === "" || p.categoria === selectedCategory;

            // Filtro por precio
            const matchesPrice = p.precio <= maxPrice;

            // Filtro por stock
            const stock = p.stock || 0;
            const matchesStock = (stock > 10 && showAvailable) ||
                (stock > 0 && stock <= 10 && showLow) ||
                (stock === 0 && showOut);

            return matchesSearch && matchesCategory && matchesPrice && matchesStock;
        });

        render(res);
    }

    if (search) search.oninput = filter;
});
