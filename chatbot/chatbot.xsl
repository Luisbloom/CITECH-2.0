<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" indent="yes"/>

    <xsl:template match="/chatbot">
    <html>
    <head>
        <meta charset="UTF-8"/>
        <title>Asistente IA - CITECH</title>
        <link rel="stylesheet" href="../global.css"/>
        <link rel="stylesheet" type="text/css" href="chatbot.css"/>
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
        <main class="chatbot-container">
            <div class="chat-header">
                <h1><xsl:value-of select="content/titulo"/></h1>
                <p><xsl:value-of select="content/subtitulo"/></p>
            </div>

            <div class="chat-interface">
                <div class="chat-window" id="chatWindow">
                    <div class="message bot-message">
                        <div class="avatar">🤖</div>
                        <div class="text">
                            <xsl:value-of select="content/intro"/>
                        </div>
                    </div>
                </div>

                <div class="suggestions">
                    <p>Sugerencias:</p>
                    <div class="suggestion-chips">
                        <xsl:for-each select="content/sugerencias/sugerencia">
                            <button class="chip" onclick="sendSuggestion(this.innerText)">
                                <xsl:value-of select="."/>
                            </button>
                        </xsl:for-each>
                    </div>
                </div>

                <div class="input-area">
                    <input type="text" id="userInput" placeholder="Escribe tu consulta aquí..." onkeypress="handleKeyPress(event)"/>
                    <button onclick="sendMessage()">Enviar</button>
                </div>
            </div>
        </main>

        <script src="chatbot.js"></script>
        <script src="../global-nav.js"></script>
    </body>
    </html>
    </xsl:template>

</xsl:stylesheet>
