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
                <button class="btn-secondary" id="btn-reload-xml">🔄 Recargar desde XML</button>
                <button class="btn-primary" id="btn-add-product">+ Añadir Producto</button>
            </div>
            <div id="products-table" class="table-container"></div>
        </section>

        <!-- Marketplace Panel -->
        <section id="panel-marketplace" class="admin-panel">
            <h1>Gestión de Marketplace</h1>
            <div id="marketplace-table" class="table-container"></div>
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
                    <option value="componentes">Componentes</option>
                    <option value="perifericos">Periféricos</option>
                    <option value="otros">Otros</option>
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

<script src="admin_panel.js"></script>

</body>
</html>

</xsl:template>

</xsl:stylesheet>
