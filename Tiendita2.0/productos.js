// ---- CONFIGURACIÓN DE EMAILJS (reemplazá con tus datos) ----
const EMAILJS_PUBLIC_KEY = "TU_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "TU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";
emailjs.init(EMAILJS_PUBLIC_KEY);
// -------------------------------------------------------------

let carrito = cargarCarrito();
let productoActual = null;

// ---- Persistencia: el carrito se mantiene al cambiar de página ----
function cargarCarrito() {
    try {
        const guardado = localStorage.getItem("carritoWiTiendita");
        return guardado ? JSON.parse(guardado) : [];
    } catch (e) {
        return [];
    }
}

function guardarCarrito() {
    try {
        localStorage.setItem("carritoWiTiendita", JSON.stringify(carrito));
    } catch (e) {
        console.error("No se pudo guardar el carrito:", e);
    }
}

function actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = carrito.length;
    }
}

document.addEventListener("DOMContentLoaded", actualizarContador);
// -------------------------------------------------------------------

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
        guardarCarrito();
        actualizarContador();

        // Borramos el alert para que no salte ningún aviso en pantalla
        cerrarProducto();
    }
}

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

    // El botón ahora llama a EmailJS en vez de abrir el programa de correo
    const btn = document.getElementById("btn-enviar-carrito");
    btn.removeAttribute("href");
    btn.onclick = function(e) {
        e.preventDefault();
        enviarPedido(textoDetalle, totalSuma);
    };

    document.getElementById("modal-carrito").style.display = "flex";
}

function enviarPedido(textoDetalle, totalSuma) {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Campo opcional: si en tu HTML agregás <input id="datos-cliente">, se incluye en el correo
    const campoCliente = document.getElementById("datos-cliente");
    const datosCliente = campoCliente ? campoCliente.value : "";

    const btn = document.getElementById("btn-enviar-carrito");
    const textoOriginal = btn.textContent;
    btn.textContent = "Enviando...";

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        lista_pedido: textoDetalle,
        total: totalSuma,
        datos_cliente: datosCliente
    })
    .then(function() {
        alert("¡Pedido enviado! Gracias por tu compra 💖");
        carrito = [];
        guardarCarrito();
        actualizarContador();
        cerrarCarritoModal();
    })
    .catch(function(error) {
        alert("No se pudo enviar el pedido. Probá de nuevo.");
        console.error("Error EmailJS:", error);
    })
    .finally(function() {
        btn.textContent = textoOriginal;
    });
}

function cerrarCarritoModal() {
    document.getElementById("modal-carrito").style.display = "none";
}