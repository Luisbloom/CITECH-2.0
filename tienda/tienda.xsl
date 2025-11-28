<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" indent="yes" />

  <xsl:template match="/tienda">
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>Tienda CITECH</title>
      <link rel="stylesheet" href="tienda.css"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
    </head>

    <body>
      <header class="site-header">
        <div class="brand">
          <img src="../img/logo.png" class="logo" alt="CITECH"/>
        </div>

        <nav class="main-nav">
          <a href="../index/index.xml">Inicio</a>
          <a class="active" href="productos.xml">Tienda</a>
          <a href="../perfil/perfil_usuario.xml">Perfil</a>
          <a href="../marketplace/marketplace.xml">Marketplace</a>
        </nav>

        <div class="header-actions">
          <button id="btn-login">Iniciar sesión</button>
        </div>
      </header>

      <main class="shop-main">

        <!-- HERO -->
        <section class="hero-shop">
          <div class="hero-left">
            <h1>Tienda CITECH</h1>
            <p>Productos tecnológicos de alta calidad, al estilo PCComponentes.</p>

            <div class="controls">
              <input type="search" id="search" placeholder="Buscar producto..." />
              <select id="filter-category">
                <option value="">Todas las categorías</option>
              </select>
            </div>
          </div>
        </section>

        <!-- GRID -->
        <section class="catalog">
          <div id="grid-products" class="grid"></div>
        </section>

        <!-- PRODUCTO MODAL -->
        <div id="product-modal" class="modal">
          <div class="modal-content">
            <button class="modal-close">✕</button>
            <div id="modal-body"></div>
          </div>
        </div>

      </main>

      <!-- Productos convertidos a JSON -->
      <script>
        window.CITECH_PRODUCTS = [
          <xsl:for-each select="producto">
            {
              "id": "<xsl:value-of select='id'/>",
              "nombre": "<xsl:value-of select='nombre'/>",
              "descripcion": "<xsl:value-of select='normalize-space(descripcion)'/>",
              "precio": <xsl:value-of select='precio'/>,
              "imagen": "<xsl:value-of select='imagen'/>",
              "categoria": "<xsl:value-of select='categoria'/>"
            }<xsl:if test="position() != last()">,</xsl:if>
          </xsl:for-each>
        ];
      </script>

      <script src="tienda.js"></script>
    </body>
  </html>
  </xsl:template>

</xsl:stylesheet>
