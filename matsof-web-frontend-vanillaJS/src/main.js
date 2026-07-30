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
    
    if (textoBusqueda === '') {
      resultadosDropdown.classList.add('oculto');
      resultadosDropdown.innerHTML = '';
      renderizarProductos(productos);
      return;
    }

    const productosFiltrados = productos.filter(producto => {
      const nombreProducto = producto.nombre.toLowerCase();
      const categoriaProducto = producto.categoria.toLowerCase();
      return nombreProducto.includes(textoBusqueda) || categoriaProducto.includes(textoBusqueda);
    });

    renderizarProductos(productosFiltrados);
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
    
    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    if (botonesFiltro) botonesFiltro.forEach(btn => btn.classList.remove('activo'));
  });

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
// 7. CARRITO DE COMPRAS (AGREGAR A MONGODB)
// ==========================================
const btnFlotanteWsp = document.getElementById('btn-flotante-wsp');
const contadorCarrito = document.getElementById('contador-carrito');

// URL de tu servidor
const API_CARRITO = 'http://localhost:3000/api/carrito';

if (contenedorProductos) {
  contenedorProductos.addEventListener('click', async (evento) => {
    
    if (evento.target.classList.contains('btn-agregar')) {
      
      const usuarioGuardado = localStorage.getItem('usuarioMatSof');
      
      if (!usuarioGuardado) {
        Swal.fire('¡Inicia Sesión!', 'Necesitas una cuenta para guardar productos en tu carrito.', 'info');
        abrirModal(modalLogin); 
        return; 
      }

      const usuario = JSON.parse(usuarioGuardado);
      const idProducto = parseInt(evento.target.getAttribute('data-id'));
      const productoSeleccionado = productos.find(p => p.id === idProducto);
      const precioNumerico = parseFloat(productoSeleccionado.precio.replace('S/ ', ''));

      // Opciones dinámicas
      let opcionesVariante = '';
      if (productoSeleccionado.categoria === 'Polos') {
        opcionesVariante = `
          <option value="S">Talla S</option>
          <option value="M">Talla M</option>
          <option value="L">Talla L</option>
          <option value="XL">Talla XL</option>
        `;
      } else if (productoSeleccionado.categoria === 'Tazas') {
        opcionesVariante = `
          <option value="11oz">11 Onzas (Clásica)</option>
          <option value="15oz">15 Onzas (Grande)</option>
        `;
      } else {
        opcionesVariante = `<option value="Estándar">Tamaño Estándar</option>`;
      }

      const { value: formValues, isConfirmed } = await Swal.fire({
        title: `Configurar Pedido`,
        html: `
          <h4 style="margin-bottom: 15px; color: #333;">${productoSeleccionado.nombre}</h4>
          <div style="text-align: left; font-size: 14px;">
            <label style="display:block; margin-bottom: 5px; font-weight: bold; color: var(--cmyk-magenta);">Opción / Talla:</label>
            <select id="swal-variante" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 5px;">
              ${opcionesVariante}
            </select>
            
            <label style="display:block; margin-bottom: 5px; font-weight: bold; color: var(--cmyk-cyan);">Cantidad:</label>
            <input type="number" id="swal-cantidad" value="1" min="1" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar y Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#00AEEF', 
        preConfirm: () => {
          return {
            variante: document.getElementById('swal-variante').value,
            cantidad: parseInt(document.getElementById('swal-cantidad').value)
          }
        }
      });

      if (!isConfirmed) return;

      try {
        const respuesta = await fetch(API_CARRITO, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: usuario.email,
            productoId: productoSeleccionado.id,
            nombre: productoSeleccionado.nombre,
            precio: precioNumerico,
            cantidad: formValues.cantidad,
            variante: formValues.variante 
          })
        });
        
        const data = await respuesta.json();

        if (respuesta.ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${formValues.cantidad}x ${productoSeleccionado.nombre} guardado`,
            showConfirmButton: false,
            timer: 2000,
            toast: true
          });
          
          if (btnFlotanteWsp) btnFlotanteWsp.style.display = 'block';
          if (contadorCarrito) {
            contadorCarrito.innerText = parseInt(contadorCarrito.innerText) + formValues.cantidad;
          }
        } else {
          Swal.fire('Aviso', data.mensaje, 'warning');
        }
      } catch (error) {
        Swal.fire('Error de Red', 'Asegúrate de que el servidor Backend esté encendido.', 'error');
      }
    }
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
const overlay = document.getElementById('overlay-modales');
const modalLogin = document.getElementById('modal-login');
const modalRegistro = document.getElementById('modal-registro');
const dropdownRegion = document.getElementById('dropdown-region');

const btnRegionNav = document.getElementById('btn-abrir-region'); 
const btnLoginNav = document.querySelector('.navbar-der a:nth-child(2)');  
const btnRegistroNav = document.querySelector('.btn-registro');            

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

if (btnLoginNav) {
  btnLoginNav.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (localStorage.getItem('usuarioMatSof')) {
      Swal.fire({
        title: 'Mi Perfil',
        text: 'Próximamente podrás ver tu historial de pedidos, cambiar tu contraseña y editar tus datos aquí.',
        icon: 'info',
        confirmButtonColor: '#00AEEF'
      });
      return; 
    }

    cerrarModales();
    abrirModal(modalLogin);
  });
}

if (btnRegistroNav) {
  btnRegistroNav.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarModales();
    if (btnRegistroNav.innerText === 'Salir') return; 
    abrirModal(modalRegistro);
  });
}

if (btnRegionNav) {
  btnRegionNav.addEventListener('click', async (e) => {
    e.preventDefault();
    cerrarModales(); 
    
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: 'Configuración Regional',
      html: `
        <div style="text-align: left; font-size: 14px; margin-top: 15px;">
          <label style="display:block; margin-bottom: 8px; font-weight: bold; color: var(--cmyk-cyan);">Selecciona tu moneda:</label>
          <select id="swal-moneda" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; outline: none; cursor: pointer;">
            <option value="PEN">🇵🇪 Perú (PEN - S/)</option>
            <option value="USD">🇺🇸 Estados Unidos (USD - $)</option>
            <option value="EUR">🇪🇺 Europa (EUR - €)</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#00AEEF',
      preConfirm: () => {
        const select = document.getElementById('swal-moneda');
        return {
          moneda: select.value,
          texto: select.options[select.selectedIndex].text
        }
      }
    });

    if (isConfirmed) {
      const bandera = formValues.texto.split(' ')[0]; 
      btnRegionNav.innerHTML = `<i class="fas fa-globe"></i> ${bandera} ${formValues.moneda}`;
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Moneda actualizada a ${formValues.moneda}`,
        showConfirmButton: false,
        timer: 1500,
        toast: true
      });
    }
  });
}

if (overlay) overlay.addEventListener('click', cerrarModales);
document.querySelectorAll('.btn-cerrar-modal').forEach(btn => {
  btn.addEventListener('click', cerrarModales);
});

// ==========================================
// --- CONEXIÓN AL BACKEND (FETCH API) ---
// ==========================================
const URL_BACKEND = 'http://localhost:3000/api';

const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('registro-nombre').value;
    const email = document.getElementById('registro-email').value;
    const password = document.getElementById('registro-password').value;

    try {
      const respuesta = await fetch(`${URL_BACKEND}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });
      
      const data = await respuesta.json();

      if (respuesta.ok) {
        formRegistro.reset();
        cerrarModales(); 
        await Swal.fire('¡Éxito!', data.mensaje, 'success'); 
        abrirModal(modalLogin); 
      } else {
        Swal.fire('Aviso', data.mensaje, 'warning'); 
      }
    } catch (error) {
      Swal.fire('Error de Red', 'Asegúrate de que el servidor Backend esté encendido.', 'error');
    }
  });
}

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
        
        localStorage.setItem('usuarioMatSof', JSON.stringify(data.usuario));
        actualizarMenuUsuario(); 
      } else {
        Swal.fire('Acceso Denegado', data.mensaje, 'error');
      }
    } catch (error) {
      Swal.fire('Error de Red', 'Asegúrate de que el servidor Backend esté encendido.', 'error');
    }
  });
}

const actualizarMenuUsuario = () => {
  const usuarioGuardado = localStorage.getItem('usuarioMatSof');
  
  if (usuarioGuardado && btnLoginNav && btnRegistroNav) {
    const usuario = JSON.parse(usuarioGuardado);
    
    btnLoginNav.innerHTML = `<i class="fas fa-user-circle"></i> Hola, ${usuario.nombre.split(' ')[0]}`;
    btnLoginNav.style.color = 'var(--cmyk-cyan)';
    
    btnRegistroNav.innerText = 'Salir';
    btnRegistroNav.style.backgroundColor = '#dc3545';
    
    btnRegistroNav.replaceWith(btnRegistroNav.cloneNode(true)); 
    const nuevoBtnSalir = document.querySelector('.btn-registro');
    
    nuevoBtnSalir.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioMatSof'); 
      location.reload(); 
    });
  }
};

actualizarMenuUsuario();

const btnGuardarRegion = document.getElementById('btn-guardar-region');
if (btnGuardarRegion) {
  btnGuardarRegion.addEventListener('click', () => {
    const select = document.getElementById('select-moneda');
    const regionSeleccionada = select.options[select.selectedIndex].text;
    const bandera = regionSeleccionada.split(' ')[0]; 
    const moneda = select.value; 
    
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

const escenasHero = [
  {
    titulo: "Transforma tus ideas en <span class='texto-cmyk'>productos increíbles</span>",
    imagen: "/termo-1.jpg", 
    fondo: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" 
  },
  {
    titulo: "Polos DTF Premium con <span style='color: var(--cmyk-cyan)'>colores vibrantes</span>",
    imagen: "/polo-negro.jpg", 
    fondo: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)" 
  },
  {
    titulo: "Tazas Personalizadas <span style='color: var(--cmyk-magenta)'>que enamoran</span>",
    imagen: "/taza-blanca-1.jpg", 
    fondo: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)" 
  }
];

let escenaActual = 0;

if (heroSection && heroTitulo && heroImagen) {
  setInterval(() => {
    heroTitulo.classList.add('fade-out');
    heroImagen.classList.add('fade-out');

    setTimeout(() => {
      escenaActual = (escenaActual + 1) % escenasHero.length;
      heroTitulo.innerHTML = escenasHero[escenaActual].titulo;
      heroImagen.src = escenasHero[escenaActual].imagen;
      heroSection.style.background = escenasHero[escenaActual].fondo;

      heroTitulo.classList.remove('fade-out');
      heroImagen.classList.remove('fade-out');
    }, 500); 
  }, 4000); 
}

// ==========================================
// 11. CARRITO VISUAL (NIVEL PRO - LEER Y ELIMINAR)
// ==========================================
if (btnFlotanteWsp) {
  btnFlotanteWsp.addEventListener('click', async (evento) => {
    evento.preventDefault();
    
    // 1. Verificamos quién es el usuario
    const usuarioGuardado = localStorage.getItem('usuarioMatSof');
    if (!usuarioGuardado) {
      Swal.fire('¡Inicia Sesión!', 'Necesitas una cuenta para ver tu carrito.', 'info');
      abrirModal(modalLogin); 
      return; 
    }

    const usuario = JSON.parse(usuarioGuardado);

    try {
      // 2. Traemos la mochila del usuario desde MongoDB
      const respuesta = await fetch(`${URL_BACKEND}/carrito/${usuario.email}`);
      const carrito = await respuesta.json();

      // Si el carrito está vacío, le avisamos
      if (carrito.length === 0) {
        Swal.fire('Carrito Vacío', 'Aún no tienes productos guardados en tu nube.', 'info');
        if (contadorCarrito) contadorCarrito.innerText = '0';
        return;
      }

      // 3. Dibujamos la lista de productos
      let htmlCarrito = '<div style="text-align: left; max-height: 300px; overflow-y: auto; padding-right: 10px;">';
      let totalPagar = 0;
      let cantidadTotalItems = 0;

      carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalPagar += subtotal;
        cantidadTotalItems += item.cantidad;

        htmlCarrito += `
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 15px 0;">
            <div>
              <strong style="color: #333; font-size: 15px;">${item.cantidad}x ${item.nombre}</strong><br>
              <small style="color: var(--cmyk-magenta); font-weight: bold;">Talla/Opción: ${item.variante}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
              <span style="color: var(--cmyk-cyan); font-weight: bold; font-size: 16px;">S/ ${subtotal.toFixed(2)}</span>
              
              <!-- Botón de Eliminar (Lleva el _id oculto de MongoDB) -->
              <button class="btn-eliminar-item" data-id="${item._id}" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; transition: 0.3s;">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      });

      htmlCarrito += `</div><h2 style="text-align: right; margin-top: 20px; color: #333;">Total: <span style="color: var(--cmyk-cyan);">S/ ${totalPagar.toFixed(2)}</span></h2>`;

      // Actualizamos el contador visual con la cantidad real de MongoDB
      if (contadorCarrito) contadorCarrito.innerText = cantidadTotalItems;

      // 4. Mostramos la ventana PRO con SweetAlert
      Swal.fire({
        title: 'Tu Carrito en la Nube ☁️',
        html: htmlCarrito,
        width: 600,
        showCancelButton: true,
        confirmButtonText: '<i class="fab fa-whatsapp"></i> Confirmar Pedido',
        cancelButtonText: 'Seguir Comprando',
        confirmButtonColor: '#25D366', // Verde de WhatsApp
        cancelButtonColor: '#6c757d',

        // 5. ¡LA MAGIA DE ELIMINAR! (Se ejecuta al abrir la ventana)
        didOpen: () => {
          const botonesEliminar = document.querySelectorAll('.btn-eliminar-item');
          
          botonesEliminar.forEach(boton => {
            boton.addEventListener('click', async (e) => {
              // Obtenemos el _id exacto del producto que quiere borrar
              const idProductoCarrito = e.currentTarget.getAttribute('data-id');
              
              // Le decimos al Backend que lo borre de MongoDB
              const resEliminar = await fetch(`${URL_BACKEND}/carrito`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario.email, idProductoCarrito })
              });

              if (resEliminar.ok) {
                Swal.close(); // Cerramos la ventana actual
                btnFlotanteWsp.click(); // ¡Volvemos a hacerle clic automáticamente para que la lista se recargue fresca!
              }
            });
          });
        }
      }).then(async (resultado) => { // Agregamos 'async' aquí para poder esperar al Backend
         // 6. Si el usuario hace clic en "Confirmar Pedido"
         if(resultado.isConfirmed) {
            let textoMensaje = "Hola MatSof, quiero confirmar mi pedido desde la web:%0A%0A";
            
            carrito.forEach((prod, index) => {
              textoMensaje += `${index + 1}. ${prod.cantidad}x ${prod.nombre} (${prod.variante}) - S/ ${(prod.precio * prod.cantidad).toFixed(2)}%0A`;
            });
            
            textoMensaje += `%0A*Total a Pagar: S/ ${totalPagar.toFixed(2)}*%0A%0A¡Quedo atento para coordinar el pago!`;
            
            // Abrimos WhatsApp con el mensaje
            window.open(`https://wa.me/51983400330?text=${textoMensaje}`, '_blank');

            // --- NUEVO: VACIAR CARRITO AUTOMÁTICAMENTE ---
            try {
              // Le ordenamos al Backend que limpie la base de datos
              await fetch(`${URL_BACKEND}/carrito/vaciar`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario.email })
              });
              
              // Limpiamos visualmente la página
              if (contadorCarrito) contadorCarrito.innerText = '0';
              if (btnFlotanteWsp) btnFlotanteWsp.style.display = 'none'; // Ocultamos el botón porque ya no hay nada
              
            } catch (error) {
              console.error('Error al intentar vaciar el carrito', error);
            }
         }
      });

    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No pudimos conectar con tu carrito.', 'error');
    }
  });
}