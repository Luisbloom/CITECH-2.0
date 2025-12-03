function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!data.nombre || !data.email || !data.mensaje) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    // Simulate API call
    const button = form.querySelector('button');
    const originalText = button.innerText;

    button.disabled = true;
    button.innerText = 'Enviando...';

    setTimeout(() => {
        alert(`¡Gracias ${data.nombre}! Hemos recibido tu mensaje. Te contactaremos pronto al correo ${data.email}.`);
        form.reset();
        button.disabled = false;
        button.innerText = originalText;
    }, 1500);
}
