let carrito = [];
let productoActual = null;

function toggleMenuCategorias() {
    const menu = document.getElementById("menu-desplegable");
    if (menu.classList.contains("show")) {
        menu.classList.remove("show");
    } else {
        menu.classList.add("show");
    }
}

function filtrarCategoria(categoriaElegida) {
    const productos = document.querySelectorAll(".producto");
    productos.forEach(function(producto) {
        const categoriaProducto = producto.dataset.categoria;
        if (categoriaElegida === 'todos' || categoriaProducto === categoriaElegida) {
            producto.style.display = "block";
        } else {
            producto.style.display = "none";
        }
    });
    const menu = document.getElementById("menu-desplegable");
    if (menu) {
        menu.classList.remove("show");
    }
}

// 3. Scroll suave al presionar "Ver productos" (ahora enfoca exactamente en el banner de envío gratis)
function scrollAProductos() {
    const seccion = document.getElementById("seccion-envio");
    if (seccion) {
        seccion.scrollIntoView({ behavior: 'smooth' });
    }
}

function verProducto(nombre, precioTexto, categoria, descripcion, destinatario, imagen, precioNumero) {
    productoActual = {
        nombre: nombre,
        precio: precioNumero
    };

    document.getElementById("nombre").textContent = nombre;
    document.getElementById("precio").textContent = precioTexto;
    document.getElementById("categoria").textContent = categoria;
    document.getElementById("descripcion").textContent = descripcion;
    document.getElementById("destinatario").textContent = destinatario;
    document.getElementById("foto-grande").src = imagen;

    document.getElementById("ventana").style.display = "flex";
}

function cerrarProducto() {
    document.getElementById("ventana").style.display = "none";
}

// 6. Agregar al carrito desde el modal (sin mensajes molestos)
function agregarAlCarrito() {
    if (productoActual !== null) {
        carrito.push(productoActual);

        // Actualizamos el contador en el botón del carrito arriba de forma silenciosa
        document.getElementById("contador-carrito").textContent = carrito.length;

        // Borramos el alert para que no salte ningún aviso en pantalla
        cerrarProducto();
    }
}

// ---- CONFIGURACIÓN DE EMAILJS (reemplazá con tus datos) ----
const EMAILJS_PUBLIC_KEY = "wQZrD_66llS0THolY";
const EMAILJS_SERVICE_ID = "service_szpbdpb";
const EMAILJS_TEMPLATE_ID = "template_h2t6oln";

function enviarPedido(textoDetalle, totalSuma) {
    // Correo de la tienda: acá llega el pedido
    const CORREO_TIENDA = "witiendita@gmail.com";

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // 1) Verificaciones antes de enviar (cada una avisa qué está mal)
    if (typeof emailjs === "undefined") {
        alert("No se cargó EmailJS. Revisá que Index.html tenga el <script> de EmailJS antes de productos.js y que tengas internet.");
        return;
    }

    if (EMAILJS_PUBLIC_KEY === "TU_PUBLIC_KEY" || EMAILJS_SERVICE_ID === "TU_SERVICE_ID" || EMAILJS_TEMPLATE_ID === "TU_TEMPLATE_ID") {
        alert("Faltan completar los códigos de EmailJS al principio de la sección del carrito en productos.js");
        return;
    }

    const campoEmail = document.getElementById("email-cliente");
    if (!campoEmail) {
        alert("Falta la casilla del correo en el carrito. Usá el Index.html nuevo (tiene id=\"email-cliente\").");
        return;
    }

    // 2) Datos del cliente
    const emailCliente = campoEmail.value.trim();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCliente);
    if (!emailValido) {
        alert("Ingresá un correo electrónico válido (por ejemplo nombre@gmail.com) para que podamos contactarte.");
        campoEmail.focus();
        return;
    }

    const campoCliente = document.getElementById("datos-cliente");
    const datosCliente = campoCliente ? campoCliente.value.trim() : "";

    // 3) Mensaje completo armado acá, así la plantilla de EmailJS solo necesita {{message}}
    const mensaje = "¡Hola WiTiendita! Nuevo pedido:\n\n" +
        textoDetalle +
        "\nTotal a pagar: $" + totalSuma +
        "\n\nCorreo del cliente: " + emailCliente +
        "\nNombre y teléfono: " + (datosCliente || "(no indicado)");

    const btn = document.getElementById("btn-enviar-carrito");
    const textoOriginal = btn.textContent;
    btn.textContent = "Enviando...";

    // 4) Envío
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: CORREO_TIENDA,
        reply_to: emailCliente,
        subject: "Pedido de la Tienda - WiTiendita",
        message: mensaje,
        email_cliente: emailCliente,
        lista_pedido: textoDetalle,
        total: totalSuma,
        datos_cliente: datosCliente
    }, EMAILJS_PUBLIC_KEY)
    .then(function() {
        alert("¡Pedido enviado! Gracias por tu compra 💖");
        carrito = [];
        document.getElementById("contador-carrito").textContent = 0;
        campoEmail.value = "";
        if (campoCliente) campoCliente.value = "";
        cerrarCarritoModal();
    })
    .catch(function(error) {
        const detalle = (error && (error.text || error.message)) || "Error desconocido";
        alert("No se pudo enviar el pedido.\n\nMotivo: " + detalle);
        console.error("Error EmailJS:", error);
    })
    .finally(function() {
        btn.textContent = textoOriginal;
    });
}
// -------------------------------------------------------------

function abrirCarritoModal() {
    const contenedorItems = document.getElementById("lista-carrito-items");
    contenedorItems.innerHTML = "";

    let totalSuma = 0;
    let textoDetalle = "";

    if (carrito.length === 0) {
        contenedorItems.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
        carrito.forEach(function(item, index) {
            totalSuma = totalSuma + item.precio;
            textoDetalle += "- " + item.nombre + " ($" + item.precio + ")\n";

            const p = document.createElement("p");
            p.textContent = (index + 1) + ". " + item.nombre + " - $" + item.precio;
            contenedorItems.appendChild(p);
        });
    }

    document.getElementById("total-precio").textContent = totalSuma;

    // El botón ahora envía el pedido con EmailJS
    const btn = document.getElementById("btn-enviar-carrito");
    btn.removeAttribute("href");
    btn.onclick = function(e) {
        e.preventDefault();
        enviarPedido(textoDetalle, totalSuma);
    };

    document.getElementById("modal-carrito").style.display = "flex";
}

function cerrarCarritoModal() {
    document.getElementById("modal-carrito").style.display = "none";
}