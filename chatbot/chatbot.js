function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();

    if (text) {
        addMessage(text, 'user');
        input.value = '';

        // Simulate bot thinking and response
        setTimeout(() => {
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 1000);
    }
}

function sendSuggestion(text) {
    addMessage(text, 'user');
    setTimeout(() => {
        const response = getBotResponse(text);
        addMessage(response, 'bot');
    }, 1000);
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(text, sender) {
    const chatWindow = document.getElementById('chatWindow');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerText = sender === 'bot' ? '🤖' : '👤';

    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.innerText = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(textDiv);

    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getBotResponse(input) {
    // Normalizar entrada: minúsculas y sin acentos
    input = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Respuestas específicas para las sugerencias
    if (input.includes('diferencias entre intel y amd')) {
        return "Intel suele destacar en rendimiento mononúcleo y productividad, mientras que AMD ofrece excelente eficiencia y rendimiento multinúcleo. Para gaming, los AMD con tecnología 3D V-Cache son líderes actuales.";
    } else if (input.includes('presupuesto') && input.includes('entrada')) {
        return "Para un PC gaming de entrada (1080p ultra), recomendamos un presupuesto de entre 700€ y 900€. Esto te permitiría montar un Ryzen 5 o i5 junto con una RTX 4060 o RX 7600.";
    } else if (input.includes('temperatura') && input.includes('cpu')) {
        return "Si tienes problemas de temperatura: 1. Limpia el polvo de los ventiladores. 2. Cambia la pasta térmica si es antigua. 3. Asegúrate de que el disipador haga buen contacto. 4. Mejora el flujo de aire de la caja.";
    } else if (input.includes('jugar en 4k') && input.includes('grafica')) {
        return "Para jugar en 4K nativo con fluidez, recomendamos la NVIDIA GeForce RTX 4090 o la RTX 4080 Super. Si buscas algo más ajustado, la RX 7900 XTX de AMD es una gran opción.";
    }

    // Respuestas generales por palabras clave
    else if (input.includes('hola') || input.includes('buenos')) {
        return "¡Hola! ¿En qué puedo ayudarte con tu configuración o compra hoy?";
    } else if (input.includes('precio') || input.includes('costo')) {
        return "Nuestros precios varían según el componente. Puedes visitar la sección de Tienda para ver ofertas actualizadas.";
    } else if (input.includes('grafica') || input.includes('gpu')) {
        return "Tenemos una amplia gama. Para 1080p: RTX 4060. Para 1440p: RTX 4070/Super. Para 4K: RTX 4080/4090.";
    } else if (input.includes('procesador') || input.includes('cpu')) {
        return "Intel Core i9-14900K y Ryzen 9 7950X3D son los líderes actuales. Para calidad/precio, el Ryzen 7 7800X3D es el rey del gaming.";
    } else if (input.includes('ayuda') || input.includes('soporte')) {
        return "Claro, describe tu problema técnico y trataré de guiarte, o puedes contactar a nuestro equipo humano en la sección de Contacto.";
    } else {
        return "Entiendo. Esa es una consulta interesante. Como soy una IA en entrenamiento, te sugiero revisar nuestra sección de Servicios o contactar a un especialista humano para detalles más específicos.";
    }
}
