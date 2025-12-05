<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes"/>

<xsl:template match="/adminpanel">

<html>
<head>
    <meta charset="UTF-8"/>
    <title>Admin Panel - CITECH</title>
    <link rel="stylesheet" href="../global.css"/>
    <link rel="stylesheet" href="admin_panel.css"/>
</head>

<body>

<header>
    <img src="{header/logo}" class="logo"/>
    <nav>
        <ul>
            <xsl:for-each select="header/menu/item">
                <li><a href="{@link}"><xsl:value-of select="."/></a></li>
            </xsl:for-each>
        </ul>
    </nav>
</header>

<div class="admin-container">
    <aside class="admin-sidebar">
        <h2>Panel Admin</h2>
        <button class="sidebar-btn active" data-panel="dashboard">📊 Dashboard</button>
        <button class="sidebar-btn" data-panel="products">📦 Productos Tienda</button>
        <button class="sidebar-btn" data-panel="marketplace">🛒 Marketplace</button>
        <button class="sidebar-btn" data-panel="users">👥 Usuarios</button>
        <button class="sidebar-btn" data-panel="messages">✉️ Mensajes</button>
        <button class="sidebar-btn" data-panel="movements">💳 Movimientos</button>
        <button class="sidebar-btn logout" id="btn-logout">🚪 Salir</button>
    </aside>

    <main class="admin-main">
        <!-- Dashboard Panel -->
        <section id="panel-dashboard" class="admin-panel active">
            <h1>Dashboard</h1>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-info">
                        <div class="stat-label">Usuarios Registrados</div>
                        <div class="stat-value" id="stat-users">0</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📦</div>
                    <div class="stat-info">
                        <div class="stat-label">Productos Tienda</div>
                        <div class="stat-value" id="stat-products">0</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🛒</div>
                    <div class="stat-info">
                        <div class="stat-label">Productos Marketplace</div>
                        <div class="stat-value" id="stat-marketplace">0</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💳</div>
                    <div class="stat-info">
                        <div class="stat-label">Total Movimientos</div>
                        <div class="stat-value" id="stat-movements">0</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Products Panel -->
        <section id="panel-products" class="admin-panel">
            <h1>Gestión de Productos Tienda</h1>
            <div class="panel-controls">
                <input type="text" id="search-products" placeholder="Buscar productos..."/>
                <select id="filter-category">
                    <option value="">Todas las categorías</option>
                </select>
                <button class="btn-primary" id="btn-add-product">+ Añadir Producto</button>
            </div>
            <div id="products-table" class="table-container"></div>
        </section>

        <!-- Marketplace Panel -->
        <section id="panel-marketplace" class="admin-panel">
            <h1>Gestión de Marketplace</h1>
            <div id="marketplace-table" class="table-container"></div>
        </section>

        <!-- Messages Panel -->
        <section id="panel-messages" class="admin-panel">
            <h1>Mensajes de Contacto</h1>
            <div class="panel-controls">
                <input type="text" id="search-messages" placeholder="Buscar mensajes..."/>
                <select id="filter-message-status">
                    <option value="">Todos los mensajes</option>
                    <option value="unread">No leídos</option>
                    <option value="read">Leídos</option>
                </select>
            </div>
            <div id="messages-table" class="table-container"></div>
        </section>

        <!-- Users Panel -->
        <section id="panel-users" class="admin-panel">
            <h1>Gestión de Usuarios</h1>
            <div id="users-table" class="table-container"></div>
        </section>

        <!-- Movements Panel -->
        <section id="panel-movements" class="admin-panel">
            <h1>Historial de Movimientos</h1>
            <div class="panel-controls">
                <input type="text" id="search-movements" placeholder="Buscar movimientos..."/>
                <select id="filter-movement-type">
                    <option value="">Todos los tipos</option>
                    <option value="compra_tienda">Compra Tienda</option>
                    <option value="compra_market">Compra Marketplace</option>
                    <option value="recarga">Recarga</option>
                </select>
            </div>
            <div id="movements-table" class="table-container"></div>
        </section>
    </main>
</div>

<!-- Product Modal -->
<div id="product-modal" class="modal">
    <div class="modal-content">
        <h2 id="modal-title">Añadir Producto</h2>
        <form id="product-form">
            <label>Nombre <input type="text" id="product-name" required="required"/></label>
            <label>Precio (€) <input type="number" id="product-price" step="0.01" min="0" required="required"/></label>
            <label>Stock <input type="number" id="product-stock" min="0" required="required"/></label>
            <label>Categoría 
                <select id="product-category" required="required">
                    <option value="Tarjetas Gráficas">Tarjetas Gráficas</option>
                    <option value="Procesadores">Procesadores</option>
                    <option value="Placas Base">Placas Base</option>
                    <option value="Almacenamiento">Almacenamiento</option>
                    <option value="Memoria RAM">Memoria RAM</option>
                    <option value="Periféricos">Periféricos</option>
                    <option value="Sillas y Accesorios">Sillas y Accesorios</option>
                    <option value="Otros">Otros</option>
                </select>
            </label>
            <label>Descripción <textarea id="product-description"></textarea></label>
            <label>Imagen <input type="file" id="product-image" accept="image/*"/></label>
            <img id="image-preview" src="../img/default_product.png" alt="Preview"/>
            <div class="modal-buttons">
                <button type="submit" class="btn-primary">Guardar</button>
                <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancelar</button>
            </div>
        </form>
    </div>
</div>

<!-- Message View Modal -->
<div id="message-modal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 10000; align-items: center; justify-content: center;">
    <div class="modal-content" style="max-width: 600px; width: 90%; max-height: 85vh; overflow-y: auto; position: relative;">
        <span class="close" onclick="closeMessageModal()">×</span>
        <h2 id="msg-modal-title">📧 Mensaje de Contacto</h2>
        <div id="msg-modal-body" style="padding: 20px 0;">
            <!-- Content will be injected here -->
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button class="btn-secondary" id="msg-mark-read-btn" onclick="markAsReadFromModal()">Marcar como leído</button>
            <button class="btn-primary" onclick="closeMessageModal()">Cerrar</button>
        </div>
    </div>
</div>

<script src="admin_panel.js"></script>


</body>
</html>

</xsl:template>

</xsl:stylesheet>
