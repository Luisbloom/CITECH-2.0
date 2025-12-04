// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // LocalStorage keys
    const LS_CURRENT = 'CITECH_currentUser_v1';
    const LS_USERS = 'CITECH_users_v1';
    const LS_STORE = 'CITECH_store_v1';
    const LS_MARKET = 'CITECH_market_v1';
    const LS_MOV = 'CITECH_movements_v1';
    const LS_MESSAGES = 'CITECH_messages_v1';

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
        document.getElementById('stat-movements').textContent = movements.length;
    }

    function resolveImageSrc(img) {
        if (!img) return "../img/default_product.png";
        if (img.startsWith("http") || img.startsWith("data:")) return img;
        // Always use relative path to project img folder
        return "../img/" + img;
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

        // Filter logic
        const searchTerm = document.getElementById('search-products').value.toLowerCase();
        const categoryFilter = document.getElementById('filter-category').value;

        const filteredProducts = products.filter(p => {
            const matchesSearch = p.nombre.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryFilter === '' || p.categoria === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        const container = document.getElementById('products-table');

        if (filteredProducts.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--txt-soft);">No se encontraron productos</p>';
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

        filteredProducts.forEach(product => {
            html += `<tr>
                <td>${product.nombre}</td>
                <td>${product.precio.toFixed(2)}€</td>
                <td style="${product.stock <= 0 ? 'color: var(--error); font-weight: bold;' : ''}">
                    ${product.stock > 0 ? product.stock : '0 (Agotado)'}
                </td>
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
            // Only add if not already present (to avoid duplicates if re-running)
            if (!filterSelect.querySelector(`option[value="${cat}"]`)) {
                filterSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
            }
        });

        // Restore selected value
        filterSelect.value = categoryFilter;
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
            document.getElementById('product-category').value = product.categoria;
            document.getElementById('product-description').value = product.descripcion || '';
            imagePreview.src = resolveImageSrc(product.imagen);
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

        // Filter logic
        const searchTerm = document.getElementById('search-movements').value.toLowerCase();
        const typeFilter = document.getElementById('filter-movement-type').value;

        const filteredMovements = movements.filter(m => {
            const user = m.usuarioNombre || m.usuario || '';
            const prod = m.producto || '';
            const matchesSearch = user.toLowerCase().includes(searchTerm) || prod.toLowerCase().includes(searchTerm);
            const matchesType = typeFilter === '' || m.tipo === typeFilter;
            return matchesSearch && matchesType;
        });

        const container = document.getElementById('movements-table');

        if (filteredMovements.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--txt-soft);">No se encontraron movimientos</p>';
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

        filteredMovements.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(mov => {
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

    // Load messages
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]');

        // Filter logic
        const searchTerm = document.getElementById('search-messages').value.toLowerCase();
        const statusFilter = document.getElementById('filter-message-status').value;

        const filteredMessages = messages.filter(m => {
            const matchesSearch = m.nombre.toLowerCase().includes(searchTerm) ||
                m.email.toLowerCase().includes(searchTerm) ||
                m.mensaje.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === '' ||
                (statusFilter === 'read' && m.leido) ||
                (statusFilter === 'unread' && !m.leido);
            return matchesSearch && matchesStatus;
        });

        const container = document.getElementById('messages-table');

        if (filteredMessages.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--txt-soft);">No se encontraron mensajes</p>';
            return;
        }

        let html = `<table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Asunto</th>
                    <th>Mensaje</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>`;

        filteredMessages.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(msg => {
            const date = new Date(msg.fecha).toLocaleString();
            const estado = msg.leido ? '✅ Leído' : '📧 No leído';
            const estadoClass = msg.leido ? '' : 'style="font-weight: bold;"';

            const truncatedMsg = msg.mensaje.length > 50 ? msg.mensaje.substring(0, 50) + '...' : msg.mensaje;

            html += `<tr ${estadoClass} style="cursor: pointer;" onclick="viewFullMessage('${msg.id}')">
                <td>${date}</td>
                <td>${msg.nombre}</td>
                <td>${msg.email}</td>
                <td>${msg.asunto || '-'}</td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${truncatedMsg}</td>
                <td>${estado}</td>
                <td onclick="event.stopPropagation()">
                    ${!msg.leido ? `<button class="btn-secondary" onclick="markAsRead('${msg.id}')">Marcar leído</button>` : ''}
                    <button class="btn-danger" onclick="deleteMessage('${msg.id}')">Eliminar</button>
                </td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // Mark message as read
    window.markAsRead = (id) => {
        const messages = JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]');
        const msg = messages.find(m => m.id === id);
        if (msg) {
            msg.leido = true;
            localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
            loadMessages();
        }
    };

    // Delete message
    window.deleteMessage = (id) => {
        if (confirm('¿Eliminar este mensaje?')) {
            let messages = JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]');
            messages = messages.filter(m => m.id !== id);
            localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
            loadMessages();
        }
    };

    // View full message
    window.viewFullMessage = (id) => {
        const messages = JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]');
        const msg = messages.find(m => m.id === id);
        if (msg) {
            const modal = document.getElementById('message-modal');
            const body = document.getElementById('msg-modal-body');
            const markReadBtn = document.getElementById('msg-mark-read-btn');

            const htmlContent = `
                <div style="background: var(--card); padding: 24px; border-radius: 12px; border-left: 4px solid var(--accent); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="display: grid; gap: 16px;">
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <span style="color: var(--accent); font-size: 1.2em; flex-shrink: 0;">👤</span>
                            <div style="flex: 1; min-width: 0;">
                                <strong style="color: var(--accent); display: block; margin-bottom: 4px; font-size: 0.9em;">Nombre</strong>
                                <p style="margin: 0; word-wrap: break-word; overflow-wrap: break-word;">${msg.nombre}</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <span style="color: var(--accent); font-size: 1.2em; flex-shrink: 0;">📧</span>
                            <div style="flex: 1; min-width: 0;">
                                <strong style="color: var(--accent); display: block; margin-bottom: 4px; font-size: 0.9em;">Email</strong>
                                <p style="margin: 0; word-wrap: break-word; overflow-wrap: break-word; font-size: 0.95em;">${msg.email}</p>
                            </div>
                        </div>
                        ${msg.telefono ? `
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <span style="color: var(--accent); font-size: 1.2em; flex-shrink: 0;">📞</span>
                            <div style="flex: 1; min-width: 0;">
                                <strong style="color: var(--accent); display: block; margin-bottom: 4px; font-size: 0.9em;">Teléfono</strong>
                                <p style="margin: 0;">${msg.telefono}</p>
                            </div>
                        </div>` : ''}
                        ${msg.asunto ? `
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <span style="color: var(--accent); font-size: 1.2em; flex-shrink: 0;">📋</span>
                            <div style="flex: 1; min-width: 0;">
                                <strong style="color: var(--accent); display: block; margin-bottom: 4px; font-size: 0.9em;">Asunto</strong>
                                <p style="margin: 0; word-wrap: break-word; overflow-wrap: break-word;">${msg.asunto}</p>
                            </div>
                        </div>` : ''}
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <span style="color: var(--accent); font-size: 1.2em; flex-shrink: 0;">📅</span>
                            <div style="flex: 1; min-width: 0;">
                                <strong style="color: var(--accent); display: block; margin-bottom: 4px; font-size: 0.9em;">Fecha</strong>
                                <p style="margin: 0;">${new Date(msg.fecha).toLocaleString()}</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <span style="color: var(--accent); font-size: 1.2em; flex-shrink: 0;">📬</span>
                            <div style="flex: 1; min-width: 0;">
                                <strong style="color: var(--accent); display: block; margin-bottom: 4px; font-size: 0.9em;">Estado</strong>
                                <p style="margin: 0;">${msg.leido ? '✅ Leído' : '📧 No leído'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="background: var(--bg); padding: 24px; border-radius: 12px; margin-top: 20px; border: 1px solid var(--border); box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 2px solid var(--border);">
                        <span style="color: var(--accent); font-size: 1.3em;">💬</span>
                        <strong style="color: var(--accent); font-size: 1.05em;">Mensaje</strong>
                    </div>
                    <p style="margin: 0; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; max-width: 100%; hyphens: auto;">${msg.mensaje}</p>
                </div>
            `;

            body.innerHTML = htmlContent;
            markReadBtn.style.display = msg.leido ? 'none' : 'inline-block';
            markReadBtn.onclick = () => markAsReadFromModal(msg.id);
            modal.style.display = 'flex';

            // Mark as read when viewed
            if (!msg.leido) {
                msg.leido = true;
                localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
                setTimeout(() => loadMessages(), 500);
            }
        }
    };

    // Close message modal
    window.closeMessageModal = () => {
        document.getElementById('message-modal').style.display = 'none';
    };

    // Mark as read from modal
    window.markAsReadFromModal = (id) => {
        if (id) {
            markAsRead(id);
        }
        closeMessageModal();
    };

    // Event Listeners for Filters
    document.getElementById('search-products').addEventListener('input', loadProducts);
    document.getElementById('filter-category').addEventListener('change', loadProducts);

    document.getElementById('search-movements').addEventListener('input', loadMovements);
    document.getElementById('filter-movement-type').addEventListener('change', loadMovements);

    document.getElementById('search-messages').addEventListener('input', loadMessages);
    document.getElementById('filter-message-status').addEventListener('change', loadMessages);

    // Initialize
    (async () => {
        await loadProducts();
        loadDashboard();
        loadMarketplace();
        loadUsers();
        loadMovements();
        loadMessages();
    })();
});
