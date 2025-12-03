<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" indent="yes"/>

    <xsl:template match="/contacto">
    <html>
    <head>
        <meta charset="UTF-8"/>
        <title>Contacto - CITECH</title>
        <link rel="stylesheet" href="../global.css"/>
        <link rel="stylesheet" type="text/css" href="contacto.css"/>
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

        <!-- MAIN CONTENT -->
        <main class="contact-container">
            <div class="contact-info">
                <h1><xsl:value-of select="info/titulo"/></h1>
                <p class="desc"><xsl:value-of select="info/descripcion"/></p>
                
                <div class="info-cards">
                    <xsl:for-each select="info/datos/dato">
                        <div class="card">
                            <div class="icon">
                                <xsl:choose>
                                    <xsl:when test="@tipo='email'">✉️</xsl:when>
                                    <xsl:when test="@tipo='telefono'">📞</xsl:when>
                                    <xsl:when test="@tipo='direccion'">📍</xsl:when>
                                </xsl:choose>
                            </div>
                            <p><xsl:value-of select="."/></p>
                        </div>
                    </xsl:for-each>
                </div>
            </div>

            <div class="contact-form">
                <h2>Envíanos un mensaje</h2>
                <form id="contactForm" onsubmit="handleSubmit(event)">
                    <xsl:for-each select="formulario/campo">
                        <div class="form-group">
                            <label for="{@id}"><xsl:value-of select="@label"/></label>
                            <xsl:choose>
                                <xsl:when test="@tipo='textarea'">
                                    <textarea id="{@id}" name="{@id}" rows="5"></textarea>
                                </xsl:when>
                                <xsl:otherwise>
                                    <input type="{@tipo}" id="{@id}" name="{@id}"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </div>
                    </xsl:for-each>
                    <button type="submit">Enviar Mensaje</button>
                </form>
            </div>
        </main>

        <script src="contacto.js"></script>
    </body>
    </html>
    </xsl:template>

</xsl:stylesheet>
