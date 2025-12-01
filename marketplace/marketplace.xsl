<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes"/>

<xsl:template match="/marketplace">

<html>
<head>
    <meta charset="UTF-8"/>
    <title>Marketplace - CITECH</title>
    <link rel="stylesheet" href="marketplace.css"/>
</head>

<body>

<header class="header">
    <img src="../img/logo.png" class="logo"/>
    <nav>
        <a href="../index/index.xml">Inicio</a>
        <a href="../tienda/productos.xml">Tienda</a>
        <a class="active" href="marketplace.xml">Marketplace</a>
        <a href="../perfil/perfil_usuario.xml">Mi Perfil</a>
    </nav>
</header>

<main class="contenedor">

    <div class="top-bar">
        <h1>Marketplace CITECH</h1>

        <button id="btn-ir-publicar" class="btn-primary">
            Publicar Producto
        </button>
    </div>

    <!-- PANEL LISTADO -->
    <section id="panel-listado" class="panel active">

        <div class="filtros">
            <select id="filtro-categoria">
                <option value="todos">Todas las categorías</option>
                <option value="componentes">Componentes</option>
                <option value="perifericos">Periféricos</option>
                <option value="pcs">PCs</option>
                <option value="consolas">Consolas</option>
                <option value="otros">Otros</option>
            </select>
        </div>

        <div id="lista-market" class="lista-productos"></div>
    </section>

    <!-- PANEL PUBLICAR -->
    <section id="panel-publicar" class="panel">
        <h2>Publicar Producto</h2>

        <form id="form-publicar" class="formulario">

            <label>Nombre del producto</label>
            <input type="text" id="pub-nombre" required="required"/>

            <label>Precio (€)</label>
            <input type="number" id="pub-precio" min="1" required="required"/>

            <label>Categoría</label>
            <select id="pub-categoria" required="required">
                <option value="componentes">Componentes</option>
                <option value="perifericos">Periféricos</option>
                <option value="pcs">PCs</option>
                <option value="consolas">Consolas</option>
                <option value="otros">Otros</option>
            </select>

            <label>Stock</label>
            <input type="number" id="pub-stock" min="1" required="required"/>

            <label>Imagen</label>
            <input type="file" id="pub-imagen" accept="image/*"/>

            <div class="botones">
                <button type="button" id="btn-publicar" class="btn-primary">
                    Publicar
                </button>

                <button type="button" id="btn-volver" class="btn-sec">
                    Volver al Marketplace
                </button>
            </div>

        </form>
    </section>

</main>

<script src="marketplace.js"></script>

</body>
</html>

</xsl:template>

</xsl:stylesheet>
