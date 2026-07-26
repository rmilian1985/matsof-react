import './style.css'; 

// ==========================================
// 1. BASE DE DATOS (Productos)
// ==========================================
const productos = [
  {
    id: 1,
    nombre: "Polo Orgullo Peruano DTF",
    categoria: "Polos",
    precio: "S/ 45.00",
    imagen: "/diseno-peru.png" 
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
// 2. ELEMENTOS DEL DOM
// ==========================================
const contenedorProductos = document.getElementById('grid-productos');
const inputBuscador = document.getElementById('input-buscador'); 
const resultadosDropdown = document.getElementById('resultados-busqueda');

// ==========================================
// 3. FUNCIÓN GLOBAL PARA DIBUJAR PRODUCTOS
// ==========================================
function renderizarProductos(listaDatos) {
  // Si estamos en una página sin catálogo (como Nosotros), no hacemos nada aquí
  if (!contenedorProductos) return; 
  
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

// ==========================================
// 4. LÓGICA DE FILTROS (Solo en el Inicio)
// ==========================================
if (contenedorProductos) {
  renderizarProductos(productos);

  const botonesFiltro = document.querySelectorAll('.btn-filtro');
  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', (evento) => {
      if (inputBuscador) inputBuscador.value = '';
      if (resultadosDropdown) resultadosDropdown.classList.add('oculto');

      botonesFiltro.forEach(btn => btn.classList.remove('activo'));
      evento.target.classList.add('activo');

      const categoriaSeleccionada = evento.target.getAttribute('data-categoria');

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
// 5. LÓGICA DEL BUSCADOR FLOTANTE
// ==========================================
if (inputBuscador && resultadosDropdown) {
  inputBuscador.addEventListener('input', (evento) => {
    const textoBusqueda = evento.target.value.toLowerCase().trim();
    
    // Si borran el texto, ocultamos el cuadro y mostramos todos los productos
    if (textoBusqueda === '') {
      resultadosDropdown.classList.add('oculto');
      resultadosDropdown.innerHTML = '';
      renderizarProductos(productos);
      return;
    }

    // Buscamos coincidencias
    const productosFiltrados = productos.filter(producto => {
      const nombreProducto = producto.nombre.toLowerCase();
      const categoriaProducto = producto.categoria.toLowerCase();
      return nombreProducto.includes(textoBusqueda) || categoriaProducto.includes(textoBusqueda);
    });

    // Actualizamos el catálogo principal de fondo (si existe)
    renderizarProductos(productosFiltrados);

    // Dibujamos el cuadro flotante
    resultadosDropdown.innerHTML = '';

    if (productosFiltrados.length > 0) {
      productosFiltrados.forEach(producto => {
        const item = document.createElement('div');
        item.classList.add('resultado-item');
        item.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" class="resultado-img">
          <div class="resultado-info">
            <h4>${producto.nombre}</h4>
            <p>${producto.precio}</p>
          </div>
        `;
        
        // Clic en un resultado del cuadro flotante
        item.addEventListener('click', () => {
          window.location.href = '/#productos'; 
          inputBuscador.value = ''; 
          resultadosDropdown.classList.add('oculto'); 
          renderizarProductos([producto]); 
        });
        
        resultadosDropdown.appendChild(item);
      });
      resultadosDropdown.classList.remove('oculto');
    } else {
      resultadosDropdown.innerHTML = `
        <div class="resultado-item">
          <div class="resultado-info"><h4 style="color: #888;">No se encontraron productos</h4></div>
        </div>`;
      resultadosDropdown.classList.remove('oculto');
    }
    
    // Desactivamos los botones de categorías (Polos, Tazas)
    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    if (botonesFiltro) botonesFiltro.forEach(btn => btn.classList.remove('activo'));
  });

  // Ocultar el cuadro si el usuario hace clic afuera de la barra
  document.addEventListener('click', (evento) => {
    if (!inputBuscador.contains(evento.target) && !resultadosDropdown.contains(evento.target)) {
      resultadosDropdown.classList.add('oculto');
    }
  });
}

// ==========================================
// 6. FORMULARIO DE CONTACTO (EmailJS)
// ==========================================
const formulario = document.getElementById('formulario-cotizacion');

if (formulario) {
  emailjs.init("P7E3WdCKZ32p_0E0x"); 
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
        Swal.fire({
          title: '¡Cotización Enviada!',
          text: 'Hemos recibido tu mensaje. Nos contactaremos contigo muy pronto.',
          icon: 'success',
          confirmButtonColor: '#00AEEF' 
        });
        formulario.reset();
      }, function(error) {
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
// 7. CARRITO DE COMPRAS Y WSP
// ==========================================
const btnFlotanteWsp = document.getElementById('btn-flotante-wsp');

if (btnFlotanteWsp) {
  let carrito = []; 
  const contadorCarrito = document.getElementById('contador-carrito');
  const numeroWhatsApp = "51983400330"; 

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
// 8. INICIALIZAR ANIMACIONES (AOS)
// ==========================================
AOS.init({
  once: true 
});