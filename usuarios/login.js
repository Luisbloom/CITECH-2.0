const LS_USERS = "CITECH_users_v1";
const LS_CURRENT = "CITECH_currentUser_v1";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#login-form");
    const email = document.querySelector("#email");
    const pass = document.querySelector("#pass");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

        const user = users.find(u => u.email === email.value);

        if (!user) {
            alert("No existe ninguna cuenta con ese correo.");
            return;
        }

        if (user.pass !== pass.value) {
            alert("Contraseña incorrecta.");
            return;
        }

        // iniciar sesión
        localStorage.setItem(LS_CURRENT, JSON.stringify(user));

        alert("Sesión iniciada correctamente.");
        window.location.href = "../perfil/perfil_usuario.xml";
    });
});
