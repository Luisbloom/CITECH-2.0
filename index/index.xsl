<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" indent="yes"/>

    <xsl:template match="/index">
    <html>
    <head>
        <meta charset="UTF-8"/>
        <title>CITECH</title>
        <link rel="stylesheet" type="text/css" href="index.css"/>
    </head>

    <body>

        <!-- HEADER -->
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

        <!-- HERO -->
        <section class="hero">
            <div class="hero-content">
                <h1><xsl:value-of select="hero/titulo"/></h1>
                <p class="sub"><xsl:value-of select="hero/subtitulo"/></p>

                <div class="botones">
                    <xsl:for-each select="hero/botones/boton">
                        <a class="boton {@tipo}" href="{@link}">
                            <xsl:value-of select="."/>
                        </a>
                    </xsl:for-each>
                </div>

                <div class="stats">
                    <xsl:for-each select="hero/stats/stat">
                        <div class="stat">
                            <h3><xsl:value-of select="numero"/></h3>
                            <p><xsl:value-of select="texto"/></p>
                        </div>
                    </xsl:for-each>
                </div>
            </div>
        </section>

        <!-- SERVICIOS -->
        <section class="servicios" id="servicios">
            <h2><xsl:value-of select="servicios/titulo"/></h2>

            <div class="tarjetas">
                <xsl:for-each select="servicios/tarjetas/servicio">
                    <div class="tarjeta">
                        <div class="icono"><xsl:value-of select="icono"/></div>
                        <h3><xsl:value-of select="titulo"/></h3>
                        <p><xsl:value-of select="descripcion"/></p>
                    </div>
                </xsl:for-each>
            </div>
        </section>

        <!-- QUIENES SOMOS -->
        <section class="quienes" id="quienes">
            <h2><xsl:value-of select="quienes_somos/titulo"/></h2>
            <p class="desc"><xsl:value-of select="quienes_somos/descripcion"/></p>

            <div class="valores">
                <xsl:for-each select="quienes_somos/valores/valor">
                    <div class="valor">
                        <h3><xsl:value-of select="nombre"/></h3>
                        <p><xsl:value-of select="descripcion"/></p>
                    </div>
                </xsl:for-each>
            </div>
        </section>

        <!-- EQUIPO -->
        <section class="equipo" id="equipo">
            <h2><xsl:value-of select="equipo/titulo"/></h2>

            <div class="miembros">
                <xsl:for-each select="equipo/miembros/miembro">
                    <div class="miembro">
                        <img src="{foto}" class="foto"/>
                        <h3><xsl:value-of select="nombre"/></h3>
                        <p><xsl:value-of select="rol"/></p>
                    </div>
                </xsl:for-each>
            </div>
        </section>

    </body>
    </html>
    </xsl:template>

</xsl:stylesheet>
