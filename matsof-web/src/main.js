import './style.css'; // Esto le dice a Vite que cargue tus diseños

// 1. Nuestra "Base de Datos" (Arreglo de Objetos)
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

// 2. Seleccionar el contenedor vacío que dejamos en el HTML
const contenedorProductos = document.getElementById('grid-productos');

// 3. Función principal para renderizar (dibujar) los productos en pantalla
function renderizarProductos(listaDatos) {
  // Limpiamos el contenedor por si acaso
  contenedorProductos.innerHTML = '';

  // Recorremos los datos uno por uno
  listaDatos.forEach(producto => {
    // Creamos un "div" virtual para la tarjeta
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-producto');

    // Le inyectamos el HTML interno usando los datos del objeto
    tarjeta.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
      <div class="producto-info">
        <span class="producto-categoria">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p class="producto-precio">${producto.precio}</p>
        <button class="btn-cotizar">Cotizar</button>
      </div>
    `;

    // Agregamos esta tarjeta terminada al contenedor real de la página
    contenedorProductos.appendChild(tarjeta);
  });
}

// 4. Ejecutar la función al cargar la página
renderizarProductos(productos);

// ==========================================
// 5. LÓGICA DE FILTROS (Interactividad)
// ==========================================

// Seleccionamos todos los botones que tengan la clase 'btn-filtro'
const botonesFiltro = document.querySelectorAll('.btn-filtro');

// A cada botón le agregamos un "escuchador de eventos" (EventListener) para detectar clics
botonesFiltro.forEach(boton => {
  boton.addEventListener('click', (evento) => {
    
    // a) Quitar la clase 'activo' de todos los botones para resetear su diseño
    botonesFiltro.forEach(btn => btn.classList.remove('activo'));
    
    // b) Agregar la clase 'activo' SOLAMENTE al botón que recibió el clic
    const botonClickeado = evento.target;
    botonClickeado.classList.add('activo');

    // c) Obtener el nombre de la categoría desde el atributo 'data-categoria' del HTML
    const categoriaSeleccionada = botonClickeado.getAttribute('data-categoria');

    // d) Filtrar los datos como si fuera una consulta de base de datos
    if (categoriaSeleccionada === 'Todos') {
      // Si eligió "Todos", enviamos el arreglo original completo a dibujar
      renderizarProductos(productos); 
    } else {
      // Si eligió otra cosa, filtramos el arreglo. 
      // Nos quedamos solo con los productos cuya categoría coincida.
      const productosFiltrados = productos.filter(producto => producto.categoria === categoriaSeleccionada);
      
      // Dibujamos el nuevo arreglo filtrado
      renderizarProductos(productosFiltrados); 
    }
  });
});

// ==========================================
// 6. FORMULARIO DE CONTACTO (EmailJS)
// ==========================================

// Inicializar EmailJS con tu Public Key
emailjs.init("P7E3WdCKZ32p_0E0x");

const formulario = document.getElementById('formulario-cotizacion');
const botonEnviar = document.querySelector('.btn-enviar');

formulario.addEventListener('submit', function(evento) {
  // Prevenir que la página se recargue al enviar el formulario
  evento.preventDefault();

  // Cambiar el texto del botón para que el usuario sepa que está cargando
  const textoOriginal = botonEnviar.innerText;
  botonEnviar.innerText = 'Enviando...';
  botonEnviar.disabled = true;

  // Recopilar los datos exactos que pusimos en la plantilla de EmailJS
  const parametros = {
    nombre: document.getElementById('nombre').value,
    correo: document.getElementById('correo').value,
    servicio: document.getElementById('servicio').value,
    mensaje: document.getElementById('mensaje').value,
  };

  // Enviar el correo usando tu Service ID y Template ID
  emailjs.send("service_9c7ka5f", "template_orfycuz", parametros)
    .then(function(respuesta) {
      console.log('¡ÉXITO!', respuesta.status, respuesta.text);
      alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
      formulario.reset(); // Limpiar los campos del formulario
    }, function(error) {
      console.log('Fallo al enviar...', error);
      alert('Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
    })
    .finally(function() {
      // Restaurar el botón a su estado normal
      botonEnviar.innerText = textoOriginal;
      botonEnviar.disabled = false;
    });
});