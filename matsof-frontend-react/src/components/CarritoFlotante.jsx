import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const URL_BACKEND = 'https://matsof-react.onrender.com/api';

function CarritoFlotante({ usuario, setModalActivo, actualizador }) {
  const [cantidadTotal, setCantidadTotal] = useState(0);

  // Cada vez que el "actualizador" cambie (o el usuario inicie sesión), leemos MongoDB
  useEffect(() => {
    if (usuario) {
      fetch(`${URL_BACKEND}/carrito/${usuario.email}`)
        .then(res => res.json())
        .then(data => {
          const totalItems = data.reduce((suma, item) => suma + item.cantidad, 0);
          setCantidadTotal(totalItems);
        })
        .catch(err => console.error(err));
    } else {
      setCantidadTotal(0); // Si sale de su cuenta, el carrito vuelve a 0
    }
  }, [usuario, actualizador]);

  const abrirCarritoVisual = async (e) => {
    e.preventDefault();
    
    if (!usuario) {
      Swal.fire('¡Inicia Sesión!', 'Necesitas una cuenta para ver tu carrito.', 'info');
      setModalActivo('login');
      return; 
    }

    try {
      const respuesta = await fetch(`${URL_BACKEND}/carrito/${usuario.email}`);
      const carrito = await respuesta.json();

      if (carrito.length === 0) {
        Swal.fire('Carrito Vacío', 'Aún no tienes productos guardados en tu nube.', 'info');
        return;
      }

      let htmlCarrito = '<div style="text-align: left; max-height: 300px; overflow-y: auto; padding-right: 10px;">';
      let totalPagar = 0;

      carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalPagar += subtotal;

        htmlCarrito += `
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 15px 0;">
            <div>
              <strong style="color: #333; font-size: 15px;">${item.cantidad}x ${item.nombre}</strong><br>
              <small style="color: var(--cmyk-magenta); font-weight: bold;">Talla/Opción: ${item.variante}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
              <span style="color: var(--cmyk-cyan); font-weight: bold; font-size: 16px;">S/ ${subtotal.toFixed(2)}</span>
              <button class="btn-eliminar-item" data-id="${item._id}" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; transition: 0.3s;">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      });

      htmlCarrito += `</div><h2 style="text-align: right; margin-top: 20px; color: #333;">Total: <span style="color: var(--cmyk-cyan);">S/ ${totalPagar.toFixed(2)}</span></h2>`;

      Swal.fire({
        title: 'Tu Carrito en la Nube ☁️',
        html: htmlCarrito,
        width: 600,
        showCancelButton: true,
        confirmButtonText: '<i class="fab fa-whatsapp"></i> Confirmar Pedido',
        cancelButtonText: 'Seguir Comprando',
        confirmButtonColor: '#25D366', 
        cancelButtonColor: '#6c757d',
        didOpen: () => {
          const botonesEliminar = document.querySelectorAll('.btn-eliminar-item');
          botonesEliminar.forEach(boton => {
            boton.addEventListener('click', async (e) => {
              const idProductoCarrito = e.currentTarget.getAttribute('data-id');
              const resEliminar = await fetch(`${URL_BACKEND}/carrito`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario.email, idProductoCarrito })
              });

              if (resEliminar.ok) {
                Swal.close();
                document.getElementById('btn-flotante-wsp').click(); // Reabre la ventana actualizada
              }
            });
          });
        }
      }).then(async (resultado) => {
         if(resultado.isConfirmed) {
            let textoMensaje = "Hola MatSof, quiero confirmar mi pedido desde la web:%0A%0A";
            carrito.forEach((prod, index) => {
              textoMensaje += `${index + 1}. ${prod.cantidad}x ${prod.nombre} (${prod.variante}) - S/ ${(prod.precio * prod.cantidad).toFixed(2)}%0A`;
            });
            textoMensaje += `%0A*Total a Pagar: S/ ${totalPagar.toFixed(2)}*%0A%0A¡Quedo atento para coordinar el pago!`;
            
            window.open(`https://wa.me/51983400330?text=${textoMensaje}`, '_blank');

            // Vaciamos el carrito en el backend tras comprar
            try {
              await fetch(`${URL_BACKEND}/carrito/vaciar`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario.email })
              });
              setCantidadTotal(0); // Reseteamos el contador visualmente
            } catch (error) {
              console.error(error);
            }
         }
      });

    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No pudimos conectar con tu carrito.', 'error');
    }
  };

  // Solo dibujamos el botón si hay items en el carrito (o podrías dejarlo siempre visible quitando este if)
  return (
    // Le agregamos un style={{ display: 'flex' }} para vencer al CSS antiguo
    <a 
      href="#" 
      id="btn-flotante-wsp" 
      className="btn-flotante-wsp" 
      onClick={abrirCarritoVisual}
      style={{ display: 'flex' }} 
    >
      <i className="fas fa-shopping-cart"></i>
      <span className="texto-flotante">Enviar Pedido</span>
      <span id="contador-carrito" className="badge-carrito">{cantidadTotal}</span>
    </a>
  );
}

export default CarritoFlotante;