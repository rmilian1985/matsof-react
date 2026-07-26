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
    imagen: "/polo-blanco.jpg" 
  },
  {
    id: 2,
    nombre: "Taza Mágica Corporativa",
    categoria: "Tazas",
    precio: "S/ 25.00",
    imagen: "/taza-blanca-1.jpg"
  },
  {
    id: 3,
    nombre: "Termo Digital 500ml",
    categoria: "Termos",
    precio: "S/ 55.00",
    imagen: "/termo-1.jpg"
  },
  {
    id: 4,
    nombre: "Polo Personalizado Logo",
    categoria: "Polos",
    precio: "S/ 50.00",
    imagen: "/polo-negro.jpg"
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

// ==========================================
// 9. LÓGICA DE MODALES Y BACKEND (NIVEL PRO)
// ==========================================

// Seleccionar los elementos del DOM (Cajas y Fondos)
const overlay = document.getElementById('overlay-modales');
const modalLogin = document.getElementById('modal-login');
const modalRegistro = document.getElementById('modal-registro');
const dropdownRegion = document.getElementById('dropdown-region');

// Seleccionar los botones de la barra de navegación superior
const btnRegionNav = document.getElementById('btn-abrir-region'); // "ES / PEN"
const btnLoginNav = document.querySelector('.navbar-der a:nth-child(2)');  // "Entrar"
const btnRegistroNav = document.querySelector('.btn-registro');            // "Registrarse"

// Funciones para abrir y cerrar ventanas suavemente
const abrirModal = (modal) => {
  if (overlay) overlay.classList.remove('oculto');
  if (modal) modal.classList.remove('oculto');
};

const cerrarModales = () => {
  if (overlay) overlay.classList.add('oculto');
  if (modalLogin) modalLogin.classList.add('oculto');
  if (modalRegistro) modalRegistro.classList.add('oculto');
  if (dropdownRegion) dropdownRegion.classList.add('oculto');
};

// Asignar los eventos de clic a los botones de navegación
if (btnLoginNav) {
  btnLoginNav.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarModales();
    abrirModal(modalLogin);
  });
}

if (btnRegistroNav) {
  btnRegistroNav.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarModales();
    // Si el usuario ya está logueado, este botón actúa como "Salir" (se configura más abajo)
    if (btnRegistroNav.innerText === 'Salir') return; 
    abrirModal(modalRegistro);
  });
}

if (btnRegionNav) {
  btnRegionNav.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarModales();
    if (dropdownRegion) dropdownRegion.classList.remove('oculto');
  });
}

// Cerrar si hacen clic en el fondo negro o en las 'X'
if (overlay) overlay.addEventListener('click', cerrarModales);
document.querySelectorAll('.btn-cerrar-modal').forEach(btn => {
  btn.addEventListener('click', cerrarModales);
});

// ==========================================
// --- CONEXIÓN AL BACKEND (FETCH API) ---
// ==========================================
const URL_BACKEND = 'http://localhost:3000/api';

// 1. Función para Registrar un Usuario
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Capturamos lo que escribió el usuario
    const nombre = document.getElementById('registro-nombre').value;
    const email = document.getElementById('registro-email').value;
    const password = document.getElementById('registro-password').value;

    try {
      // Enviamos los datos al servidor Node.js
      const respuesta = await fetch(`${URL_BACKEND}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });
      
      const data = await respuesta.json(); // Leemos la respuesta del servidor

      if (respuesta.ok) {
        formRegistro.reset();
        cerrarModales(); // 1. Ocultamos la ventana de registro primero
        
        // 2. El 'await' detiene el código hasta que el usuario presione "OK"
        await Swal.fire('¡Éxito!', data.mensaje, 'success'); 
        
        // 3. Una vez que presionó OK, recién le abrimos la ventana de Iniciar Sesión
        abrirModal(modalLogin); 
      } else {
        Swal.fire('Aviso', data.mensaje, 'warning'); // Ej: El correo ya existe
      }
    } catch (error) {
      Swal.fire('Error de Red', 'Asegúrate de que el servidor Backend esté encendido.', 'error');
    }
  });
}

// 2. Función para Iniciar Sesión (Login)
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const respuesta = await fetch(`${URL_BACKEND}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await respuesta.json();

      if (respuesta.ok) {
        Swal.fire('¡Bienvenido!', `Qué gusto verte de nuevo, ${data.usuario.nombre}`, 'success');
        formLogin.reset();
        cerrarModales();
        
        // Guardamos al usuario en la memoria secreta del navegador (localStorage)
        localStorage.setItem('usuarioMatSof', JSON.stringify(data.usuario));
        actualizarMenuUsuario(); // Cambiamos la barra de navegación
      } else {
        Swal.fire('Acceso Denegado', data.mensaje, 'error');
      }
    } catch (error) {
      Swal.fire('Error de Red', 'Asegúrate de que el servidor Backend esté encendido.', 'error');
    }
  });
}

// 3. Función para cambiar el menú si el usuario ya está dentro
const actualizarMenuUsuario = () => {
  const usuarioGuardado = localStorage.getItem('usuarioMatSof');
  
  if (usuarioGuardado && btnLoginNav && btnRegistroNav) {
    const usuario = JSON.parse(usuarioGuardado);
    
    // Cambiamos "Entrar" por el nombre del usuario
    btnLoginNav.innerHTML = `<i class="fas fa-user-circle"></i> Hola, ${usuario.nombre.split(' ')[0]}`;
    btnLoginNav.style.color = 'var(--cmyk-cyan)';
    
    // Cambiamos "Registrarse" por un botón rojo de "Salir"
    btnRegistroNav.innerText = 'Salir';
    btnRegistroNav.style.backgroundColor = '#dc3545';
    
    // Le quitamos el evento de abrir el modal y le ponemos el de cerrar sesión
    btnRegistroNav.replaceWith(btnRegistroNav.cloneNode(true)); 
    const nuevoBtnSalir = document.querySelector('.btn-registro');
    
    nuevoBtnSalir.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioMatSof'); // Borramos su sesión
      location.reload(); // Recargamos la página para volver a estado normal
    });
  }
};

// Al entrar a la página, revisamos si el usuario había dejado su sesión abierta
actualizarMenuUsuario();

// 4. Lógica para el botón de Guardar Moneda/Región
const btnGuardarRegion = document.getElementById('btn-guardar-region');
if (btnGuardarRegion) {
  btnGuardarRegion.addEventListener('click', () => {
    const select = document.getElementById('select-moneda');
    const regionSeleccionada = select.options[select.selectedIndex].text;
    const bandera = regionSeleccionada.split(' ')[0]; // Extrae el emoji (Ej: 🇵🇪)
    const moneda = select.value; // PEN, USD, EUR
    
    btnRegionNav.innerHTML = `<i class="fas fa-globe"></i> ${bandera} ${moneda}`;
    cerrarModales();
    
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `Moneda actualizada a ${moneda}`,
      showConfirmButton: false,
      timer: 1500,
      toast: true
    });
  });
}

// ==========================================
// 10. HERO DINÁMICO (ESTILO PRINTFUL)
// ==========================================
const heroSection = document.getElementById('hero-section');
const heroTitulo = document.getElementById('hero-titulo');
const heroImagen = document.getElementById('hero-imagen-dinamica');

// Aquí configuramos las "diapositivas" o escenas
const escenasHero = [
  {
    // Escena 1: General (Gris claro)
    titulo: "Transforma tus ideas en <span class='texto-cmyk'>productos increíbles</span>",
    imagen: "/termo-1.jpg", 
    fondo: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" 
  },
  {
    // Escena 2: Polos (Tono Cyan)
    titulo: "Polos DTF Premium con <span style='color: var(--cmyk-cyan)'>colores vibrantes</span>",
    imagen: "/polo-negro.jpg", // Asegúrate de que este nombre coincida con tu foto en la carpeta public
    fondo: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)" 
  },
  {
    // Escena 3: Tazas (Tono Magenta)
    titulo: "Tazas Personalizadas <span style='color: var(--cmyk-magenta)'>que enamoran</span>",
    imagen: "/taza-blanca-1.jpg", // Asegúrate de que este nombre coincida
    fondo: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)" 
  }
];

let escenaActual = 0;

if (heroSection && heroTitulo && heroImagen) {
  // Ejecutar este ciclo cada 4000 milisegundos (4 segundos)
  setInterval(() => {
    
    // 1. Ocultamos suavemente el texto y la imagen actual
    heroTitulo.classList.add('fade-out');
    heroImagen.classList.add('fade-out');

    // 2. Esperamos medio segundo (500ms) a que se vuelvan invisibles para cambiar los datos
    setTimeout(() => {
      // Pasamos a la siguiente escena (y si es la última, volvemos a la primera)
      escenaActual = (escenaActual + 1) % escenasHero.length;
      
      heroTitulo.innerHTML = escenasHero[escenaActual].titulo;
      heroImagen.src = escenasHero[escenaActual].imagen;
      heroSection.style.background = escenasHero[escenaActual].fondo;

      // 3. Los volvemos a aparecer suavemente
      heroTitulo.classList.remove('fade-out');
      heroImagen.classList.remove('fade-out');
      
    }, 500); 

  }, 4000); 
}