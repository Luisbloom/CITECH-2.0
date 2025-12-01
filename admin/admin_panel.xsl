<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="yes"/>

<xsl:template match="/adminpanel">
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Admin Panel - CITECH</title>
  <link rel="stylesheet" href="admin_panel.css"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body>

<header class="admin-header">
  <img src="../img/logo.png" class="logo" alt="CITECH"/>
  <h1>Panel de Administración</h1>
  <nav>
    <a href="../index/index.xml">Inicio</a>
    <a href="../perfil/perfil_usuario.xml">Perfil</a>
  </nav>
</header>

<main class="admin-container">

  <!-- SIDEBAR -->
  <aside class="admin-sidebar">
    <ul>
      <li class="sel" data-panel="dashboard">Dashboard</li>
      <li data-panel="tienda">Tienda</li>
      <li data-panel="marketplace">Marketplace</li>
      <li data-panel="movimientos">Movimientos</li>
      <li data-panel="herramientas">Herramientas</li>
      <li data-panel="logout">Cerrar sesión</li>
    </ul>
  </aside>

  <!-- MAIN -->
  <section class="admin-main">

    <!-- DASHBOARD -->
    <div id="panel-dashboard" class="panel active">
      <h2>Dashboard</h2>
      <div class="cards">
        <div class="card"><h3>Usuarios</h3><p id="count-users-val">0</p></div>
        <div class="card"><h3>Tienda</h3><p id="count-store-val">0</p></div>
        <div class="card"><h3>Marketplace</h3><p id="count-market-val">0</p></div>
        <div class="card"><h3>Movimientos</h3><p id="count-mov-val">0</p></div>
      </div>
    </div>


    <!-- TIENDA -->
    <div id="panel-tienda" class="panel">
      <h2>Gestión de la Tienda</h2>

      <div class="toolbar">
        <button id="btn-add-store" class="btn">Añadir producto</button>
      </div>

      <!-- MODAL PARA AÑADIR PRODUCTOS -->
      <div id="store-form-modal" class="modal hidden">
        <div class="modal-box">
          <h3 id="store-form-title">Nuevo producto</h3>

          <div class="form-grid">
            
            <label>Nombre del producto</label>
            <input id="store-nombre" />

            <label>Precio (€)</label>
            <input id="store-precio" type="number" min="0" step="0.01"/>

            <label>Stock disponible</label>
            <input id="store-stock" type="number" min="0"/>

            <label>Categoría</label>
            <select id="store-categoria">
              <option value="componentes">Componentes</option>
              <option value="perifericos">Periféricos</option>
              <option value="pcs">PCs</option>
              <option value="consolas">Consolas</option>
              <option value="otros">Otros</option>
            </select>

            <label>Descripción</label>
            <textarea id="store-desc"></textarea>

            <label>Imagen</label>
            <input id="store-img" type="file" accept="image/*"/>

          </div>

          <img id="store-img-preview" class="preview-img" src="../img/default_product.png"/>

          <div class="modal-buttons">
            <button id="store-save" class="btn">Guardar</button>
            <button id="store-cancel" class="btn danger">Cancelar</button>
          </div>
        </div>
      </div>

      <div id="store-list" class="table-wrap"></div>
    </div>


    <!-- MARKETPLACE -->
    <div id="panel-marketplace" class="panel">
      <h2>Marketplace</h2>
      <div id="market-list" class="table-wrap"></div>
    </div>


    <!-- MOVIMIENTOS -->
    <div id="panel-movimientos" class="panel">
      <h2>Movimientos</h2>
      <input id="mov-search" class="toolbar" placeholder="Buscar movimientos..."/>
      <div id="mov-list" class="table-wrap"></div>
    </div>


    <!-- HERRAMIENTAS -->
    <div id="panel-herramientas" class="panel">
      <h2>Herramientas</h2>
      <div class="tool-grid">
        <div class="tool">
          <h4>Vaciar marketplace</h4>
          <button id="btn-clear-market" class="btn danger">Vaciar</button>
        </div>

        <div class="tool">
          <h4>Recalcular</h4>
          <button id="btn-recalc" class="btn">Recalcular</button>
        </div>
      </div>
    </div>

    <!-- LOGOUT -->
    <div id="panel-logout" class="panel">
      <h2>Cerrar sesión</h2>
      <button id="btn-admin-logout" class="btn danger">Cerrar sesión</button>
    </div>

  </section>

</main>

<script src="admin_panel.js"></script>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
