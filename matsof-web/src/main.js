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