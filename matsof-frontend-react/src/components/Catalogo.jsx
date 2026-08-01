import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const URL_BACKEND = 'https://matsof-react.onrender.com/api';

// Recibimos las herramientas necesarias desde App.jsx
function Catalogo({ usuario, setModalActivo, notificarCarrito }) {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  
  // 1. EL ALMACÉN: Estado para los productos que vienen de MongoDB
  const [productos, setProductos] = useState([]);
  
  // 2. EL INDICADOR: Para saber si estamos esperando la respuesta de Internet
  const [cargando, setCargando] = useState(true);

  // 3. LA LLAMADA AL BACKEND: Se ejecuta automáticamente al entrar a la página
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch(`${URL_BACKEND}/productos`);
        const datos = await respuesta.json();
        
        // Guardamos los datos de MongoDB en el estado y quitamos la pantalla de carga
        setProductos(datos);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  const productosFiltrados = categoriaActiva === 'Todos' 
    ? productos 
    : productos.filter(producto => producto.categoria === categoriaActiva);

  const agregarAlCarrito = async (producto) => {
    if (!usuario) {
      Swal.fire('¡Inicia Sesión!', 'Necesitas una cuenta para guardar productos en tu carrito.', 'info');
      setModalActivo('login');
      return;
    }

    // 4. ADAPTACIÓN DE PRECIO: Como ahora es número desde MongoDB, lo usamos directo
    const precioNumerico = parseFloat(producto.precio); 
    let opcionesVariante = '';
    
    if (producto.categoria === 'Polos') {
      opcionesVariante = `
        <option value="S">Talla S</option>
        <option value="M">Talla M</option>
        <option value="L">Talla L</option>
        <option value="XL">Talla XL</option>
      `;
    } else if (producto.categoria === 'Tazas') {
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
        <h4 style="margin-bottom: 15px; color: #333;">${producto.nombre}</h4>
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
      const respuesta = await fetch(`${URL_BACKEND}/carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario.email,
          productoId: producto._id, // 5. ADAPTACIÓN DE ID: Usamos _id de MongoDB
          nombre: producto.nombre,
          precio: precioNumerico,
          cantidad: formValues.cantidad,
          variante: formValues.variante 
        })
      });
      
      if (respuesta.ok) {
        Swal.fire({ position: 'top-end', icon: 'success', title: `${formValues.cantidad}x ${producto.nombre} guardado`, showConfirmButton: false, timer: 2000, toast: true });
        
        // ¡LA SEÑAL! Le avisamos al botón flotante que debe actualizarse
        notificarCarrito(); 
      }
    } catch (error) {
      Swal.fire('Error de Red', 'Asegúrate de que el servidor Backend esté encendido.', 'error');
    }
  };

  // Pantalla temporal mientras llegan los datos del servidor
  if (cargando) {
    return (
      <section id="productos" className="seccion-catalogo" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2 style={{ color: '#666' }}>Cargando catálogo oficial... ⏳</h2>
      </section>
    );
  }

  return (
    <section id="productos" className="seccion-catalogo">
      <h2 className="titulo-seccion">Nuestro Catálogo</h2>
      
      <div className="filtros-categoria">
        {['Todos', 'Polos', 'Tazas', 'Termos'].map(categoria => (
          <button key={categoria} className={`btn-filtro ${categoriaActiva === categoria ? 'activo' : ''}`} onClick={() => setCategoriaActiva(categoria)}>
            {categoria}
          </button>
        ))}
      </div>
      
      <div id="grid-productos" className="grid-productos">
        {productosFiltrados.map(producto => (
          // Usamos _id como identificador único para React
          <div key={producto._id} className="tarjeta-producto" data-aos="fade-up" data-aos-duration="1000">
            <img src={producto.imagen} alt={producto.nombre} className="producto-img" />
            <div className="producto-info">
              <span className="producto-categoria">{producto.categoria}</span>
              <h3>{producto.nombre}</h3>
              {/* Formateamos visualmente el precio matemático para que muestre S/ y decimales */}
              <p className="producto-precio">S/ {parseFloat(producto.precio).toFixed(2)}</p>
              
              <button className="btn-cotizar btn-agregar" onClick={() => agregarAlCarrito(producto)}>
                Agregar al Pedido
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Catalogo;