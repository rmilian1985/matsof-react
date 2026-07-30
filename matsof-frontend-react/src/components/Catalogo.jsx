import React, { useState } from 'react';
import Swal from 'sweetalert2';

const URL_BACKEND = 'https://matsof-react.onrender.com/api';

const productos = [
  { id: 1, nombre: "Polo Orgullo Peruano DTF", categoria: "Polos", precio: "S/ 45.00", imagen: "/polo-blanco.jpg" },
  { id: 2, nombre: "Taza Mágica Corporativa", categoria: "Tazas", precio: "S/ 25.00", imagen: "/taza-blanca-1.jpg" },
  { id: 3, nombre: "Termo Digital 500ml", categoria: "Termos", precio: "S/ 55.00", imagen: "/termo-1.jpg" },
  { id: 4, nombre: "Polo Personalizado Logo", categoria: "Polos", precio: "S/ 50.00", imagen: "/polo-negro.jpg" }
];

// Recibimos las herramientas necesarias desde App.jsx
function Catalogo({ usuario, setModalActivo, notificarCarrito }) {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  const productosFiltrados = categoriaActiva === 'Todos' 
    ? productos 
    : productos.filter(producto => producto.categoria === categoriaActiva);

  const agregarAlCarrito = async (producto) => {
    if (!usuario) {
      Swal.fire('¡Inicia Sesión!', 'Necesitas una cuenta para guardar productos en tu carrito.', 'info');
      setModalActivo('login');
      return;
    }

    const precioNumerico = parseFloat(producto.precio.replace('S/ ', ''));
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
          productoId: producto.id,
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
          <div key={producto.id} className="tarjeta-producto" data-aos="fade-up" data-aos-duration="1000">
            <img src={producto.imagen} alt={producto.nombre} className="producto-img" />
            <div className="producto-info">
              <span className="producto-categoria">{producto.categoria}</span>
              <h3>{producto.nombre}</h3>
              <p className="producto-precio">{producto.precio}</p>
              
              {/* Conectamos el botón de agregar a nuestra nueva función */}
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