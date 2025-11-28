<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes" />

<xsl:template match="/registro">

<html>
<head>
    <meta charset="UTF-8"/>
    <title>Crear Cuenta - CITECH</title>
    <link rel="stylesheet" href="registro.css"/>
</head>

<body>

<div class="reg-container">

    <form id="reg-form" class="reg-card">

        <h1>Crear Cuenta</h1>

        <!-- Nombre -->
        <label>Nombre completo</label>
        <input type="text" id="nombre" required="required" placeholder="Ej: Luis Fernández"/>

        <!-- Usuario -->
        <label>Nombre de usuario</label>
        <input type="text" id="usuario" required="required" placeholder="Ej: LuisTech"/>

        <!-- Email -->
        <label>Email</label>
        <input type="email" id="email" required="required" placeholder="example@correo.com"/>

        <!-- Teléfono -->
        <label>Teléfono</label>
        <input type="text" id="telefono" required="required" placeholder="Ej: 612345678"/>

        <!-- Dirección -->
        <label>Calle</label>
        <input type="text" id="dir-calle" required="required" placeholder="Ej: Calle Mayor 22"/>

        <label>Ciudad</label>
        <input type="text" id="dir-ciudad" required="required" placeholder="Ej: Madrid"/>

        <label>Provincia</label>
        <input type="text" id="dir-provincia" required="required" placeholder="Ej: Madrid"/>

        <label>Código Postal</label>
        <input type="text" id="dir-cp" required="required" placeholder="Ej: 28001"/>

        <!-- Fecha nacimiento -->
        <label>Fecha de nacimiento</label>
        <input type="date" id="nacimiento" required="required"/>

        <!-- Pregunta de seguridad -->
        <label>Pregunta de seguridad (opcional)</label>
        <input type="text" id="seguridad" placeholder="Ej: Nombre de tu primera mascota"/>

        <!-- Contraseñas -->
        <label>Contraseña</label>
        <input type="password" id="pass" required="required" minlength="4"/>

        <label>Confirmar contraseña</label>
        <input type="password" id="pass2" required="required" minlength="4"/>

        <!-- Términos -->
        <div class="check-group">
            <input type="checkbox" id="terminos" required="required"/>
            <label for="terminos">Acepto los términos y condiciones</label>
        </div>

        <!-- Botón -->
        <button id="btn-registrar" class="btn-primary" type="submit">
            Crear cuenta
        </button>

        <p class="alt">
            ¿Ya tienes una cuenta?
            <a href="login.xml">Iniciar sesión</a>
        </p>

    </form>

</div>

<script src="registro.js"></script>

</body>
</html>

</xsl:template>

</xsl:stylesheet>
