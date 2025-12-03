<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" indent="yes" />

  <xsl:template match="/tienda">
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>Tienda CITECH</title>
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

        <section class="hero-shop">
          <h1>Tienda CITECH</h1>
          <div class="controls">
            <input id="search" placeholder="Buscar..."/>
            <select id="filter-category"><option value="">Todas</option></select>
          </div>
        </section>

        <section class="catalog">
          <div id="grid-products" class="grid"></div>
        </section>

        <div id="product-modal" class="modal">
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
            "nombre": "<xsl:value-of select='nombre'/>",
            "descripcion": "<xsl:value-of select='normalize-space(descripcion)'/>",
            "precio": <xsl:value-of select='precio'/>,
            "imagen": "<xsl:value-of select='imagen'/>",
            "categoria": "<xsl:value-of select='categoria'/>"
          }<xsl:if test="position()!=last()">,</xsl:if>
        </xsl:for-each>
      ];
      </script>

      <script src="tienda.js"></script>
    </body>
  </html>
  </xsl:template>

</xsl:stylesheet>
