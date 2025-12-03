<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet 
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes"/>

<xsl:template match="/perfil">

<html>
<head>
    <meta charset="UTF-8"/>
    <title>Perfil - CITECH</title>
    <link rel="stylesheet" href="../global.css"/>
    <link rel="stylesheet" href="perfil_usuario.css"/>
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
        <a id="admin-link" href="../admin/admin_panel.xml" style="display:none; margin-left: 20px; color: #ff3b3b; font-weight: bold;">
            Panel Admin
        </a>
    </nav>
</header>

<main class="perfil-container">

    <!-- SIDEBAR -->
    <aside class="perfil-sidebar">
        <h2>Tu Cuenta</h2>
        <ul>
            <li class="selected" data-panel="info">Información</li>
            <li data-panel="editar">Editar Perfil</li>
            <li data-panel="password">Cambiar Contraseña</li>
            <li data-panel="foto">Foto de Perfil</li>
            <li data-panel="saldo">Saldo</li>
            <li data-panel="carrito">Carrito</li>
            <li data-panel="movimientos">Movimientos</li>

            <!-- NUEVO: Convertirse en Admin -->
            <li data-panel="adminupgrade">Convertirse en Admin</li>

            <li data-panel="logout">Cerrar Sesión</li>
        </ul>
    </aside>

    <!-- PANEL PRINCIPAL -->
    <section class="perfil-main">

        <!-- PANEL INFORMACION -->
        <div id="panel-info" class="panel active">
            <h2>Información Personal</h2>

            <div class="foto-preview">
                <img id="foto-perfil-preview" src="" alt="Foto de perfil"/>
            </div>

            <p><strong>Nombre:</strong> <span id="info-nombre"></span></p>
            <p><strong>Usuario:</strong> <span id="info-usuario"></span></p>
            <p><strong>Email:</strong> <span id="info-email"></span></p>
            <p><strong>Teléfono:</strong> <span id="info-telefono"></span></p>

            <h3>Dirección</h3>
            <p><strong>Calle:</strong> <span id="info-calle"></span></p>
            <p><strong>Ciudad:</strong> <span id="info-ciudad"></span></p>
            <p><strong>Provincia:</strong> <span id="info-provincia"></span></p>
            <p><strong>Código Postal:</strong> <span id="info-cp"></span></p>

            <p><strong>Fecha de nacimiento:</strong> <span id="info-nacimiento"></span></p>
        </div>

        <!-- PANEL EDITAR PERFIL -->
        <div id="panel-editar" class="panel">
            <h2>Editar Perfil</h2>

            <form id="form-editar" class="formulario">

                <label>Nombre Completo</label>
                <input type="text" id="edit-nombre"/>

                <label>Email</label>
                <input type="email" id="edit-email"/>

                <label>Teléfono</label>
                <input type="text" id="edit-telefono"/>

                <h3>Dirección</h3>

                <label>Calle</label>
                <input type="text" id="edit-calle"/>

                <label>Ciudad</label>
                <input type="text" id="edit-ciudad"/>

                <label>Provincia</label>
                <input type="text" id="edit-provincia"/>

                <label>Código Postal</label>
                <input type="text" id="edit-cp"/>

                <label>Fecha de nacimiento</label>
                <input type="date" id="edit-nacimiento"/>

                <button type="button" id="btn-guardar-editar" class="btn-primary">Guardar Cambios</button>
            </form>
        </div>

        <!-- PANEL CAMBIAR CONTRASEÑA -->
        <div id="panel-password" class="panel">
            <h2>Cambiar Contraseña</h2>

            <form class="formulario">
                <label>Contraseña actual</label>
                <input type="password" id="pass-actual"/>

                <label>Nueva contraseña</label>
                <input type="password" id="pass-nueva"/>

                <label>Confirmar nueva contraseña</label>
                <input type="password" id="pass-confirm"/>

                <button type="button" id="btn-cambiar-pass" class="btn-primary">
                    Actualizar Contraseña
                </button>
            </form>
        </div>

        <!-- PANEL FOTO DE PERFIL -->
        <div id="panel-foto" class="panel">
            <h2>Foto de Perfil</h2>

            <div class="foto-preview">
                <img id="foto-actual" src="" alt="Tu foto"/>
            </div>

            <input type="file" id="foto-input" accept="image/*"/>
            <button id="btn-guardar-foto" class="btn-primary">Guardar Foto</button>
        </div>

        <!-- PANEL SALDO -->
        <div id="panel-saldo" class="panel">
            <h2>Saldo</h2>
            <p class="saldo-actual">Saldo actual: <span id="saldo-usuario"></span></p>

            <div class="recargar-box">
                <input id="cantidad-recarga" type="number" min="1" placeholder="Cantidad a recargar (€)"/>
                <button id="btn-recargar" class="btn-primary">Recargar</button>
            </div>
        </div>

        <!-- PANEL CARRITO -->
        <div id="panel-carrito" class="panel">
            <h2>Carrito</h2>
            <div id="carrito-lista"></div>
            <div class="carrito-totales">
                <h3>Total: <span id="carrito-total">0.00€</span></h3>
                <button id="btn-comprar" class="btn-primary">Pagar Carrito</button>
            </div>
        </div>

        <!-- PANEL MOVIMIENTOS -->
        <div id="panel-movimientos" class="panel">
            <h2>Historial de Movimientos</h2>
            <table class="tabla-mov">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Monto</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody id="tabla-mov-body"></tbody>
            </table>
        </div>

        <!-- PANEL CONVERTIRSE EN ADMIN -->
        <div id="panel-adminupgrade" class="panel">
            <h2>Convertirse en Administrador</h2>
            <p>Con un perfil administrador tendrás acceso completo al panel de control CITECH.</p>
            <button id="btn-hacer-admin" class="btn-primary">Convertirme en Admin</button>
        </div>

        <!-- PANEL LOGOUT -->
        <div id="panel-logout" class="panel">
            <h2>Cerrar Sesión</h2>
            <p>Se cerrará tu sesión actual.</p>
            <button id="btn-logout" class="btn-danger">Cerrar Sesión</button>
        </div>

    </section>
</main>

<script src="perfil_usuario.js"></script>

</body>
</html>

</xsl:template>
</xsl:stylesheet>
