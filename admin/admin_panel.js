// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // LocalStorage keys
    const LS_CURRENT = 'CITECH_currentUser_v1';
    const LS_USERS = 'CITECH_users_v1';
    const LS_STORE = 'CITECH_store_v1';
    const LS_MARKET = 'CITECH_market_v1';
    const LS_MOV = 'CITECH_movements_v1';

    // Check admin access
    const currentUser = JSON.parse(localStorage.getItem(LS_CURRENT) || 'null');
    if (!currentUser || currentUser.rol !== 'admin') {
        alert('Acceso denegado. Solo administradores.');
        window.location.href = '../index/index.xml';
        return;
    }

    // Load products from XML
    async function loadProductsFromXML() {
        try {
            const response = await fetch('../tienda/productos.xml');
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            const productNodes = xmlDoc.querySelectorAll('producto');
            const xmlProducts = [];

            productNodes.forEach(node => {
                const product = {
                    id: node.querySelector('id')?.textContent || 'prod_' + Date.now() + Math.random(),
                    nombre: node.querySelector('nombre')?.textContent || '',
                    descripcion: node.querySelector('descripcion')?.textContent?.trim() || '',
                    precio: parseFloat(node.querySelector('precio')?.textContent || '0'),
                    imagen: node.querySelector('imagen')?.textContent || 'default_product.png',
                    categoria: node.querySelector('categoria')?.textContent || 'Otros',
                    stock: parseInt(node.querySelector('stock')?.textContent || '0')
                };
                xmlProducts.push(product);
            });

            return xmlProducts;
        } catch (error) {
            console.error('Error loading XML:', error);
            alert('Error al cargar productos desde XML');
            return [];
        }
    }

    // Merge XML products with localStorage (localStorage takes precedence)
    async function syncProductsWithXML() {
        const xmlProducts = await loadProductsFromXML();
        const storedProducts = JSON.parse(localStorage.getItem(LS_STORE) || '[]');

        // Create a map of stored products by ID for quick lookup
        const storedMap = new Map(storedProducts.map(p => [p.id.toString(), p]));

        // Merge: use stored version if exists, otherwise use XML version
        const mergedProducts = xmlProducts.map(xmlProd => {
            const stored = storedMap.get(xmlProd.id.toString());
            return stored || xmlProd;
        });

        // Add any stored products that aren't in XML (user-added products)
        storedProducts.forEach(stored => {
            if (!xmlProducts.find(xml => xml.id.toString() === stored.id.toString())) {
                mergedProducts.push(stored);
            }
        });

        localStorage.setItem(LS_STORE, JSON.stringify(mergedProducts));
        return mergedProducts;
    }

    // Panel navigation
    const panelBtns = document.querySelectorAll('.sidebar-btn:not(.logout)');
    const panels = document.querySelectorAll('.admin-panel');

    panelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const panelId = btn.dataset.panel;

            // Update buttons
            panelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panels
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`panel-${panelId}`).classList.add('active');
        });
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        if (confirm('¿Cerrar sesión?')) {
            localStorage.removeItem(LS_CURRENT);
            window.location.href = '../index/index.xml';
        }
    });

    // Load data
    function loadDashboard() {
        const users = JSON.parse(localStorage.getItem(LS_USERS) || '[]');
        const store = JSON.parse(localStorage.getItem(LS_STORE) || '[]');
        const market = JSON.parse(localStorage.getItem(LS_MARKET) || '[]');
        const movements = JSON.parse(localStorage.getItem(LS_MOV) || '[]');

        document.getElementById('stat-users').textContent = users.length;
        document.getElementById('stat-products').textContent = store.length;
        document.getElementById('stat-marketplace').textContent = market.length;
        document.getElementById('stat-movements').textContent = movements.length;
    }

    // Products management
    let editingProductId = null;
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');
    const imageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');

    async function loadProducts() {
        // Sync with XML on first load if localStorage is empty
        const stored = JSON.parse(localStorage.getItem(LS_STORE) || '[]');
        if (stored.length === 0) {
            await syncProductsWithXML();
        }

        const products = JSON.parse(localStorage.getItem(LS_STORE) || '[]');
        const container = document.getElementById('products-table');

        if (products.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--txt-soft);">No hay productos en la tienda</p>';
            return;
        }

        let html = `<table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>`;

        products.forEach(product => {
            html += `<tr>
                <td>${product.nombre}</td>
                <td>${product.precio.toFixed(2)}€</td>
                <td>${product.stock}</td>
                <td>${product.categoria}</td>
                <td>
                    <button class="btn-secondary" onclick="editProduct('${product.id}')">Editar</button>
                    <button class="btn-danger" onclick="deleteProduct('${product.id}')">Eliminar</button>
                </td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;

        // Populate category filter
        const categories = [...new Set(products.map(p => p.categoria))];
        const filterSelect = document.getElementById('filter-category');
        filterSelect.innerHTML = '<option value="">Todas las categorías</option>';
        categories.forEach(cat => {
            filterSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
    }

    // Add product button
    document.getElementById('btn-add-product').addEventListener('click', () => {
        editingProductId = null;
        productForm.reset();
        imagePreview.src = '../img/default_product.png';
        document.getElementById('modal-title').textContent = 'Añadir Producto';
        productModal.classList.add('active');
    });

    // Reload from XML button
    document.getElementById('btn-reload-xml').addEventListener('click', async () => {
        if (confirm('¿Recargar productos desde XML? Los productos editados mantendrán sus cambios.')) {
            await syncProductsWithXML();
            await loadProducts();
            loadDashboard();
            alert('Productos sincronizados desde XML');
        }
    });

    // Cancel modal
    document.getElementById('btn-cancel-modal').addEventListener('click', () => {
        productModal.classList.remove('active');
    });

    // Image preview
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => imagePreview.src = e.target.result;
            reader.readAsDataURL(file);
        }
    });

    // Save product
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const products = JSON.parse(localStorage.getItem(LS_STORE) || '[]');
        const productData = {
            id: editingProductId || 'prod_' + Date.now(),
            nombre: document.getElementById('product-name').value,
            precio: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            categoria: document.getElementById('product-category').value,
            descripcion: document.getElementById('product-description').value,
            imagen: imagePreview.src
        };

        if (editingProductId) {
            const index = products.findIndex(p => p.id === editingProductId);
            products[index] = productData;
        } else {
            products.push(productData);
        }

        localStorage.setItem(LS_STORE, JSON.stringify(products));
        productModal.classList.remove('active');
        loadProducts();
        loadDashboard();
    });

    // Global functions for product actions
    window.editProduct = (id) => {
        const products = JSON.parse(localStorage.getItem(LS_STORE) || '[]');
        const product = products.find(p => p.id === id);

        if (product) {
            editingProductId = id;
            document.getElementById('product-name').value = product.nombre;
            document.getElementById('product-price').value = product.precio;
            document.getElementById('product-stock').value = product.stock;
            document.getElementById('product-category').value = product.categoria;
            document.getElementById('product-description').value = product.descripcion || '';
            imagePreview.src = product.imagen;
            document.getElementById('modal-title').textContent = 'Editar Producto';
            productModal.classList.add('active');
        }
    };

    window.deleteProduct = (id) => {
        if (confirm('¿Eliminar este producto?')) {
            let products = JSON.parse(localStorage.getItem(LS_STORE) || '[]');
            products = products.filter(p => p.id !== id);
            localStorage.setItem(LS_STORE, JSON.stringify(products));
            loadProducts();
            loadDashboard();
        }
    };

    // Load marketplace
    function loadMarketplace() {
        const market = JSON.parse(localStorage.getItem(LS_MARKET) || '[]');
        const users = JSON.parse(localStorage.getItem(LS_USERS) || '[]');
        const container = document.getElementById('marketplace-table');

        if (market.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--txt-soft);">No hay productos en marketplace</p>';
            return;
        }

        let html = `<table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Vendedor</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>`;

        market.forEach(item => {
            const seller = users.find(u => u.id === item.vendedor);
            const sellerName = seller ? seller.usuario : 'Desconocido';
            const date = new Date(item.fecha).toLocaleDateString();

            html += `<tr>
                <td>${item.nombre}</td>
                <td>${sellerName}</td>
                <td>${item.precio.toFixed(2)}€</td>
                <td>${item.stock}</td>
                <td>${item.categoria}</td>
                <td>${date}</td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // Load users
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem(LS_USERS) || '[]');
        const container = document.getElementById('users-table');

        if (users.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--txt-soft);">No hay usuarios registrados</p>';
            return;
        }

        let html = `<table>
            <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>`;

        users.forEach(user => {
            html += `<tr>
                <td>${user.usuario}</td>
                <td>${user.email}</td>
                <td>${user.nombre || '-'}</td>
                <td>${user.rol || 'user'}</td>
                <td>${(user.saldo || 0).toFixed(2)}€</td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // Load movements
    function loadMovements() {
        const movements = JSON.parse(localStorage.getItem(LS_MOV) || '[]');
        const container = document.getElementById('movements-table');

        if (movements.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--txt-soft);">No hay movimientos registrados</p>';
            return;
        }

        let html = `<table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Tipo</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Monto</th>
                </tr>
            </thead>
            <tbody>`;

        movements.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(mov => {
            const date = new Date(mov.fecha).toLocaleString();
            html += `<tr>
                <td>${date}</td>
                <td>${mov.usuarioNombre || mov.usuario}</td>
                <td>${mov.tipo}</td>
                <td>${mov.producto || '-'}</td>
                <td>${mov.qty || '-'}</td>
                <td>${mov.monto.toFixed(2)}€</td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // Initialize
    (async () => {
        await loadProducts();
        loadDashboard();
        loadMarketplace();
        loadUsers();
        loadMovements();
    })();
});
