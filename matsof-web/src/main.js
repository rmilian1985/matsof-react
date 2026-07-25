import './style.css'; // Esto le dice a Vite que cargue tus diseños

// ==========================================
// 1. BASE DE DATOS (Productos)
// ==========================================
const productos = [
  {
    id: 1,
    nombre: "Polo Orgullo Peruano DTF",
    categoria: "Polos",
    precio: "S/ 45.00",
    imagen: "/diseno-peru.png" // Imagen temporal
  },
  {
    id: 2,
    nombre: "Taza Mágica Corporativa",
    categoria: "Tazas",
    precio: "S/ 25.00",
    imagen: "https://via.placeholder.com/300x300/F8F9FA/333333?text=Taza+Magica"
  },
  {
    id: 3,
    nombre: "Termo Digital 500ml",
    categoria: "Termos",
    precio: "S/ 55.00",
    imagen: "https://via.placeholder.com/300x300/F8F9FA/333333?text=Termo+Digital"
  },
  {
    id: 4,
    nombre: "Polo Personalizado Logo",
    categoria: "Polos",
    precio: "S/ 50.00",
    imagen: "https://via.placeholder.com/300x300/F8F9FA/333333?text=Polo+Logo"
  }
];

// ==========================================
// 2. CATÁLOGO Y FILTROS (Solo se ejecuta si existe el grid-productos)
// ==========================================
const contenedorProductos = document.getElementById('grid-productos');

if (contenedorProductos) {
  
  // Función para dibujar los productos
  function renderizarProductos(listaDatos) {
    contenedorProductos.innerHTML = '';
    
    listaDatos.forEach(producto => {
      const tarjeta = document.createElement('div');
      tarjeta.classList.add('tarjeta-producto');
      tarjeta.setAttribute('data-aos', 'fade-up');
      tarjeta.setAttribute('data-aos-duration', '1000');
      
      tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
        <div class="producto-info">
          <span class="producto-categoria">${producto.categoria}</span>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">${producto.precio}</p>
          <button class="btn-cotizar btn-agregar" data-id="${producto.id}">Agregar al Pedido</button>
        </div>
      `;
      contenedorProductos.appendChild(tarjeta);
    });
  }

  // Dibujar todos los productos al cargar
  renderizarProductos(productos);

  // Lógica de Filtros
  const botonesFiltro = document.querySelectorAll('.btn-filtro');
  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', (evento) => {
      botonesFiltro.forEach(btn => btn.classList.remove('activo'));
      const botonClickeado = evento.target;
      botonClickeado.classList.add('activo');

      const categoriaSeleccionada = botonClickeado.getAttribute('data-categoria');

      if (categoriaSeleccionada === 'Todos') {
        renderizarProductos(productos); 
      } else {
        const productosFiltrados = productos.filter(producto => producto.categoria === categoriaSeleccionada);
        renderizarProductos(productosFiltrados); 
      }
    });
  });
}

// ==========================================
// 3. FORMULARIO DE CONTACTO (Solo se ejecuta si existe el formulario)
// ==========================================
const formulario = document.getElementById('formulario-cotizacion');

if (formulario) {
  emailjs.init("P7E3WdCKZ32p_0E0x"); // Tu Public Key
  const botonEnviar = document.querySelector('.btn-enviar');

  formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    const textoOriginal = botonEnviar.innerText;
    botonEnviar.innerText = 'Enviando...';
    botonEnviar.disabled = true;

    const parametros = {
      nombre: document.getElementById('nombre').value,
      correo: document.getElementById('correo').value,
      servicio: document.getElementById('servicio').value,
      mensaje: document.getElementById('mensaje').value,
    };

    emailjs.send("service_9c7ka5f", "template_orfycuz", parametros)
      .then(function(respuesta) {
        console.log('¡ÉXITO!', respuesta.status, respuesta.text);
        Swal.fire({
          title: '¡Cotización Enviada!',
          text: 'Hemos recibido tu mensaje. Nos contactaremos contigo muy pronto.',
          icon: 'success',
          confirmButtonColor: '#00AEEF' 
        });
        formulario.reset();
      }, function(error) {
        console.log('Fallo al enviar...', error);
        Swal.fire({
          title: '¡Ups!',
          text: 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#E6007E' 
        });
      })
      .finally(function() {
        botonEnviar.innerText = textoOriginal;
        botonEnviar.disabled = false;
      });
  });
}

// ==========================================
// 4. CARRITO DE COMPRAS Y WSP (Solo se ejecuta si existe el botón flotante)
// ==========================================
const btnFlotanteWsp = document.getElementById('btn-flotante-wsp');

if (btnFlotanteWsp) {
  let carrito = []; 
  const contadorCarrito = document.getElementById('contador-carrito');
  const numeroWhatsApp = "51983400330"; // Tu número real

  // Nos aseguramos de que el grid-productos también exista en esta página antes de escuchar clics
  if (contenedorProductos) {
    contenedorProductos.addEventListener('click', (evento) => {
      if (evento.target.classList.contains('btn-agregar')) {
        const idProducto = parseInt(evento.target.getAttribute('data-id'));
        const productoSeleccionado = productos.find(p => p.id === idProducto);
        
        carrito.push(productoSeleccionado);
        contadorCarrito.innerText = carrito.length;
        btnFlotanteWsp.style.display = 'block'; 
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${productoSeleccionado.nombre} agregado`,
          showConfirmButton: false,
          timer: 1500,
          toast: true
        });
      }
    });
  }

  btnFlotanteWsp.addEventListener('click', (evento) => {
    evento.preventDefault(); 
    let textoMensaje = "Hola MatSof, quiero cotizar el siguiente pedido:%0A%0A";
    
    carrito.forEach((prod, index) => {
      textoMensaje += `${index + 1}. ${prod.nombre} (${prod.precio})%0A`;
    });
    
    textoMensaje += "%0A¡Quedo atento a su respuesta!";
    const url = `https://wa.me/${numeroWhatsApp}?text=${textoMensaje}`;
    window.open(url, '_blank');
  });
}

// ==========================================
// 5. INICIALIZAR ANIMACIONES (AOS) - Se ejecuta en todas las páginas
// ==========================================
AOS.init({
  once: true 
});