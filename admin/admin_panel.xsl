<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="yes"/>

<xsl:template match="/adminpanel">
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Admin Panel - CITECH</title>
  <link rel="stylesheet" href="admin_panel.css"/>
</head>
<body>

<header class="admin-header">
  <img src="../img/logo.png" alt="logo" class="logo"/>
  <h1>Administración — CITECH</h1>
  <nav>
    <a href="../index/index.xml">Inicio</a>
    <a href="../perfil/perfil_usuario.xml">Perfil</a>
  </nav>
</header>

<main class="admin-container">

  <aside class="admin-sidebar">
    <ul>
      <li class="sel" data-panel="dashboard">Dashboard</li>
      <li data-panel="usuarios">Usuarios</li>
      <li data-panel="marketplace">Marketplace</li>
      <li data-panel="tienda">Tienda</li>
      <li data-panel="movimientos">Movimientos</li>
      <li data-panel="compras">Compras</li>
      <li data-panel="herramientas">Herramientas</li>
      <li data-panel="logout">Cerrar sesión</li>
    </ul>
  </aside>

  <section class="admin-main">

    <div id="panel-dashboard" class="panel active">
      <h2>Dashboard</h2>
      <div class="cards">
        <div class="card">
          <h3 id="count-users">Usuarios</h3>
          <p id="count-users-val">0</p>
        </div>
        <div class="card">
          <h3 id="count-market">Productos (market)</h3>
          <p id="count-market-val">0</p>
        </div>
        <div class="card">
          <h3 id="count-mov">Movimientos</h3>
          <p id="count-mov-val">0</p>
        </div>
        <div class="card">
          <h3 id="count-buys">Compras</h3>
          <p id="count-buys-val">0</p>
        </div>
      </div>
    </div>

    <div id="panel-usuarios" class="panel">
      <h2>Usuarios</h2>

      <div class="toolbar">
        <input id="usuarios-search" placeholder="Buscar por usuario, email o id..."/>
        <button id="btn-refrescar-usuarios" class="btn">Refrescar</button>
        <button id="btn-export-usuarios" class="btn">Exportar CSV</button>
      </div>

      <div id="usuarios-list" class="table-wrap"></div>
    </div>

    <div id="panel-marketplace" class="panel">
      <h2>Marketplace</h2>

      <div class="toolbar">
        <input id="market-search" placeholder="Buscar producto o vendedor..."/>
        <select id="market-filter-cat">
          <option value="todos">Todas</option>
          <option value="componentes">Componentes</option>
          <option value="perifericos">Periféricos</option>
          <option value="pcs">PCs</option>
          <option value="consolas">Consolas</option>
          <option value="otros">Otros</option>
        </select>
        <button id="btn-refrescar-market" class="btn">Refrescar</button>
      </div>

      <div id="market-list" class="table-wrap"></div>
    </div>

    <div id="panel-tienda" class="panel">
      <h2>Tienda (inventario)</h2>

      <div class="toolbar">
        <input id="store-search" placeholder="Buscar producto tienda (si existe)"/>
        <button id="btn-refrescar-store" class="btn">Refrescar</button>
      </div>

      <div id="store-list" class="table-wrap"></div>
    </div>

    <div id="panel-movimientos" class="panel">
      <h2>Movimientos</h2>

      <div class="toolbar">
        <input id="mov-search" placeholder="Buscar por usuario / tipo / descripción"/>
        <select id="mov-filter-type">
            <option value="todos">Todos los tipos</option>
            <option value="recarga">Recarga</option>
            <option value="compra">Compra</option>
            <option value="venta_market">Venta (market)</option>
            <option value="compra_market">Compra (market)</option>
        </select>
        <button id="btn-export-mov" class="btn">Exportar CSV</button>
      </div>

      <div id="mov-list" class="table-wrap"></div>
    </div>

    <div id="panel-compras" class="panel">
      <h2>Compras</h2>
      <div class="toolbar">
        <input id="buys-search" placeholder="Buscar compras..."/>
        <button id="btn-refrescar-buys" class="btn">Refrescar</button>
      </div>
      <div id="buys-list" class="table-wrap"></div>
    </div>

    <div id="panel-herramientas" class="panel">
      <h2>Herramientas</h2>

      <div class="tool-grid">
        <div class="tool">
          <h4>Vaciar marketplace</h4>
          <p>Elimina todos los anuncios del marketplace</p>
          <button id="btn-clear-market" class="btn danger">Vaciar</button>
        </div>

        <div class="tool">
          <h4>Recalcular totales</h4>
          <p>Actualiza contadores y refresca datos</p>
          <button id="btn-recalc" class="btn">Recalcular</button>
        </div>

        <div class="tool">
          <h4>Exportar Movimientos</h4>
          <p>Descarga un CSV con todos los movimientos</p>
          <button id="btn-export-all-mov" class="btn">Exportar CSV</button>
        </div>
      </div>
    </div>

    <div id="panel-logout" class="panel">
      <h2>Cerrar sesión</h2>
      <p>Salir del panel de administración.</p>
      <button id="btn-admin-logout" class="btn danger">Cerrar sesión</button>
    </div>

  </section>
</main>

<script src="admin_panel.js"></script>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
