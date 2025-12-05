<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" indent="yes" />

  <xsl:template match="/tienda">
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>Tienda CITECH - Tecnología del Futuro</title>
      <link rel="stylesheet" href="../global.css"/>
      <link rel="stylesheet" href="tienda.css"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
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

      <main class="shop-main">

        <!-- Hero Section -->
        <section class="hero-shop">
          <div class="hero-content">
            <div class="hero-badge">▪ Tienda Premium</div>
            <h1 class="hero-title">Descubre la Tecnología del Futuro</h1>
          </div>
        </section>

        <!-- Main Content with Sidebar -->
        <div class="store-container">
          
          <!-- Sidebar -->
          <aside class="store-sidebar">
            <div class="sidebar-section">
              <h3 class="sidebar-title">⌕ Búsqueda</h3>
              <div class="search-wrapper-sidebar">
                <input id="search" type="search" placeholder="Buscar productos..."/>
              </div>
            </div>

            <div class="sidebar-section">
              <h3 class="sidebar-title">▤ Categorías</h3>
              <div id="category-filters" class="category-filters">
                <!-- Se llenará dinámicamente -->
              </div>
            </div>

            <div class="sidebar-section">
              <h3 class="sidebar-title">$ Rango de Precio</h3>
              <div class="price-filter">
                <input type="range" id="price-range" min="0" max="10000" step="50" value="10000"/>
                <div class="price-display">
                  <span>Hasta: </span>
                  <span id="price-value" class="price-value">10000€</span>
                </div>
              </div>
            </div>


            <div class="sidebar-section">
              <h3 class="sidebar-title">▦ Stock</h3>
              <div class="stock-filters">
                <label class="filter-checkbox">
                  <input type="checkbox" id="stock-available" checked="checked"/>
                  <span>✓ Disponible</span>
                </label>
                <label class="filter-checkbox">
                  <input type="checkbox" id="stock-low" checked="checked"/>
                  <span>⚠ Stock Bajo</span>
                </label>
                <label class="filter-checkbox">
                  <input type="checkbox" id="stock-out"/>
                  <span>✗ Agotado</span>
                </label>
              </div>
            </div>


            <button id="reset-filters" class="reset-filters-btn">
              ↻ Restablecer Filtros
            </button>
          </aside>

          <!-- Products Grid -->
          <section class="catalog">
            <div class="catalog-header">
              <h2>Nuestros Productos</h2>
              <div class="catalog-stats">
                <span class="stat-item">
                  <span id="product-count">0</span> productos
                </span>
              </div>
            </div>
            <div id="grid-products" class="products-grid"></div>
          </section>

        </div>

        <!-- Product Modal -->
        <div id="product-modal" class="modal">
          <div class="modal-backdrop"></div>
          <div class="modal-content">
            <button class="modal-close">✕</button>
            <div id="modal-body"></div>
          </div>
        </div>

      </main>

      <!-- Datos del XML -->
      <script>
      window.XML_PRODUCTS = [
        <xsl:for-each select="producto">
          {
            "id": "<xsl:value-of select='id'/>",
            "nombre": "<xsl:value-of select='translate(nombre, "&apos;", " ")'/> ",
            "descripcion": "<xsl:value-of select='translate(normalize-space(descripcion), "&apos;", " ")'/>",
            "precio": <xsl:value-of select='precio'/>,
            "stock": <xsl:value-of select='stock'/>,
            "imagen": "<xsl:value-of select='imagen'/>",
            "categoria": "<xsl:value-of select='categoria'/>"
          }<xsl:if test="position()!=last()">,</xsl:if>
        </xsl:for-each>
      ];
      </script>

      <script src="tienda.js"></script>
      <script src="../global-nav.js"></script>
    </body>
  </html>
  </xsl:template>

</xsl:stylesheet>
