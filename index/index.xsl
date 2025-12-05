<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" indent="yes"/>

    <xsl:template match="/index">
    <html lang="es">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>CITECH • Tecnología Premium</title>
        <link rel="stylesheet" href="../global.css"/>
        <link rel="stylesheet" href="index.css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
    </head>

    <body>

        <!-- HEADER -->
        <header class="site-header" id="header">
            <img src="{header/logo}" class="logo" alt="CITECH Logo"/>
            <nav class="nav">
                <ul>
                    <xsl:for-each select="header/menu/item">
                        <li><a href="{@link}"><xsl:value-of select="."/></a></li>
                    </xsl:for-each>
                </ul>
            </nav>
        </header>

        <!-- HERO SECTION -->
        <section class="hero" id="hero">
            <div class="hero-bg"></div>
            <div class="hero-content">
                <h1 class="hero-title" data-aos="fade-up"><xsl:value-of select="hero/titulo"/></h1>
                <p class="hero-subtitle" data-aos="fade-up" data-aos-delay="100">
                    <xsl:value-of select="hero/subtitulo"/>
                </p>

                <div class="hero-buttons" data-aos="fade-up" data-aos-delay="200">
                    <xsl:for-each select="hero/botones/boton">
                        <a href="{@link}" class="btn btn-{@tipo}">
                            <xsl:value-of select="."/>
                        </a>
                    </xsl:for-each>
                </div>

                <div class="hero-stats" data-aos="fade-up" data-aos-delay="300">
                    <xsl:for-each select="hero/stats/stat">
                        <div class="stat-card">
                            <div class="stat-number" data-count="{numero}">0</div>
                            <div class="stat-label"><xsl:value-of select="texto"/></div>
                        </div>
                    </xsl:for-each>
                </div>
            </div>
            <div class="scroll-indicator">
                <span>Scroll</span>
                <div class="scroll-arrow"></div>
            </div>
        </section>

        <!-- FEATURES SECTION -->
        <section class="features" id="features">
            <div class="container">
                <h2 class="section-title" data-aos="fade-up"><xsl:value-of select="features/titulo"/></h2>
                <div class="features-grid">
                    <xsl:for-each select="features/lista/feature">
                        <div class="feature-card" data-aos="fade-up" data-aos-delay="{position() * 100}">
                            <div class="feature-icon"><xsl:value-of select="icono"/></div>
                            <h3 class="feature-title"><xsl:value-of select="titulo"/></h3>
                            <p class="feature-description"><xsl:value-of select="descripcion"/></p>
                        </div>
                    </xsl:for-each>
                </div>
            </div>
        </section>

        <!-- SERVICIOS SECTION -->
        <section class="servicios" id="servicios">
            <div class="container">
                <h2 class="section-title" data-aos="fade-up"><xsl:value-of select="servicios/titulo"/></h2>
                
                <div class="servicios-grid">
                    <xsl:for-each select="servicios/tarjetas/servicio">
                        <div class="servicio-card" data-aos="zoom-in" data-aos-delay="{position() * 100}">
                            <div class="servicio-icon"><xsl:value-of select="icono"/></div>
                            <h3 class="servicio-title"><xsl:value-of select="titulo"/></h3>
                            <p class="servicio-description"><xsl:value-of select="descripcion"/></p>
                            <div class="servicio-price"><xsl:value-of select="precio"/></div>
                        </div>
                    </xsl:for-each>
                </div>
            </div>
        </section>

        <!-- QUIENES SOMOS SECTION -->
        <section class="quienes" id="quienes">
            <div class="container">
                <h2 class="section-title" data-aos="fade-up"><xsl:value-of select="quienes_somos/titulo"/></h2>
                <p class="section-description" data-aos="fade-up" data-aos-delay="100">
                    <xsl:value-of select="quienes_somos/descripcion"/>
                </p>

                <div class="valores-grid">
                    <xsl:for-each select="quienes_somos/valores/valor">
                        <div class="valor-card" data-aos="flip-up" data-aos-delay="{position() * 100}">
                            <div class="valor-icon"><xsl:value-of select="icono"/></div>
                            <h3 class="valor-title"><xsl:value-of select="nombre"/></h3>
                            <p class="valor-description"><xsl:value-of select="descripcion"/></p>
                        </div>
                    </xsl:for-each>
                </div>
            </div>
        </section>

        <!-- EQUIPO SECTION -->
        <section class="equipo" id="equipo">
            <div class="container">
                <h2 class="section-title" data-aos="fade-up"><xsl:value-of select="equipo/titulo"/></h2>
                
                <div class="equipo-grid">
                    <xsl:for-each select="equipo/miembros/miembro">
                        <div class="miembro-card" data-aos="fade-up" data-aos-delay="{position() * 150}">
                            <div class="miembro-image-wrapper">
                                <img src="{foto}" alt="{nombre}" class="miembro-foto"/>
                                <div class="miembro-overlay">
                                    <p class="miembro-desc"><xsl:value-of select="descripcion"/></p>
                                </div>
                            </div>
                            <div class="miembro-info">
                                <h3 class="miembro-nombre"><xsl:value-of select="nombre"/></h3>
                                <p class="miembro-rol"><xsl:value-of select="rol"/></p>
                            </div>
                        </div>
                    </xsl:for-each>
                </div>
            </div>
        </section>

        <!-- CTA SECTION -->
        <section class="cta" id="cta">
            <div class="cta-content" data-aos="zoom-in">
                <h2 class="cta-title"><xsl:value-of select="cta/titulo"/></h2>
                <p class="cta-description"><xsl:value-of select="cta/descripcion"/></p>
                <div class="cta-buttons">
                    <xsl:for-each select="cta/botones/boton">
                        <a href="{@link}" class="btn btn-{@tipo}">
                            <xsl:value-of select="."/>
                        </a>
                    </xsl:for-each>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="footer">
            <div class="container">
                <div class="footer-columns">
                    <xsl:for-each select="footer/columnas/columna">
                        <div class="footer-column">
                            <h4 class="footer-title"><xsl:value-of select="titulo"/></h4>
                            <ul class="footer-links">
                                <xsl:for-each select="enlaces/enlace">
                                    <li><a href="{@link}"><xsl:value-of select="."/></a></li>
                                </xsl:for-each>
                            </ul>
                        </div>
                    </xsl:for-each>
                </div>
                <div class="footer-bottom">
                    <p class="footer-copyright"><xsl:value-of select="footer/copyright"/></p>
                </div>
            </div>
        </footer>

        <script src="index.js"></script>
        <script src="../global-nav.js"></script>

    </body>
    </html>
    </xsl:template>

</xsl:stylesheet>
