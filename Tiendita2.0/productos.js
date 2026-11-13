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

    const correoDestino = "witiendita@gmail.com";
    const asunto = encodeURIComponent("Pedido de la Tienda - WiTiendita");
    const cuerpoMensaje = encodeURIComponent("¡Hola WiTiendita! 💖 Quisiera realizar el siguiente pedido:\n\n" + textoDetalle + "\nTotal a pagar: $" + totalSuma + "\n\nQuedo a la espera de la confirmación.");

    document.getElementById("btn-enviar-carrito").href = "mailto:" + correoDestino + "?subject=" + asunto + "&body=" + cuerpoMensaje;
    document.getElementById("modal-carrito").style.display = "flex";
}

function cerrarCarritoModal() {
    document.getElementById("modal-carrito").style.display = "none";
}