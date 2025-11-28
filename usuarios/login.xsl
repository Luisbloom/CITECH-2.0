<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet 
    version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes"/>

<xsl:template match="/login">

<html>
<head>
    <meta charset="UTF-8"/>
    <title>Iniciar Sesión - CITECH</title>
    <link rel="stylesheet" href="login.css"/>
</head>

<body>

<div class="login-container">

    <form id="login-form" class="login-card">
        <h1>Iniciar Sesión</h1>

        <label>Email</label>
        <input type="email" id="email" required="required" placeholder="example@correo.com"/>

        <label>Contraseña</label>
        <input type="password" id="pass" required="required"/>

        <button type="submit" class="btn-primary">Entrar</button>

        <p class="alt">
            ¿No tienes cuenta?
            <a href="registro.xml">Crear cuenta</a>
        </p>
    </form>

</div>

<script src="login.js"></script>

</body>
</html>

</xsl:template>

</xsl:stylesheet>
