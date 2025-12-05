const LS_USERS = "CITECH_users_v1";
const LS_CURRENT = "CITECH_currentUser_v1";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#reg-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.querySelector("#nombre").value;
        const usuario = document.querySelector("#usuario").value;
        const email = document.querySelector("#email").value;
        const telefono = document.querySelector("#telefono").value;

        const calle = document.querySelector("#dir-calle").value;
        const ciudad = document.querySelector("#dir-ciudad").value;
        const provincia = document.querySelector("#dir-provincia").value;
        const cp = document.querySelector("#dir-cp").value;

        const nacimiento = document.querySelector("#nacimiento").value;

        const pass = document.querySelector("#pass").value;
        const pass2 = document.querySelector("#pass2").value;

        if (pass !== pass2) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

        if (users.find(u => u.email === email)) {
            alert("Ya existe una cuenta con ese correo.");
            return;
        }

        if (users.find(u => u.usuario === usuario)) {
            alert("Ese nombre de usuario ya está en uso.");
            return;
        }

        const newUser = {
            id: "u_" + Date.now(),
            nombre: nombre,
            usuario: usuario,
            email: email,
            password: pass,
            telefono: telefono,
            direccion: {
                calle: calle,
                ciudad: ciudad,
                provincia: provincia,
                cp: cp
            },
            nacimiento: nacimiento,
            saldo: 0,
            tipo: "cliente",
            transacciones: []
        };

        users.push(newUser);

        localStorage.setItem(LS_USERS, JSON.stringify(users));
        localStorage.setItem(LS_CURRENT, JSON.stringify(newUser));

        alert("Cuenta creada correctamente.");
        window.location.href = "../perfil/perfil_usuario.xml";
    });
});
