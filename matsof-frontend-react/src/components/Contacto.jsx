import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

function Contacto() {
  // Estado para saber si estamos enviando el correo o no
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = (evento) => {
    evento.preventDefault(); // Evitamos que la página se recargue
    setEnviando(true);       // Cambiamos el estado a "Enviando..."

    // Inicializamos EmailJS con tu llave pública
    emailjs.init("P7E3WdCKZ32p_0E0x"); 

    // Capturamos los datos directamente del formulario (evento.target)
    const parametros = {
      nombre: evento.target.nombre.value,
      correo: evento.target.correo.value,
      servicio: evento.target.servicio.value,
      mensaje: evento.target.mensaje.value,
    };

    // Enviamos el correo usando tus IDs
    emailjs.send("service_9c7ka5f", "template_orfycuz", parametros)
      .then(() => {
        Swal.fire({
          title: '¡Cotización Enviada!',
          text: 'Hemos recibido tu mensaje. Nos contactaremos contigo muy pronto.',
          icon: 'success',
          confirmButtonColor: '#00AEEF' 
        });
        evento.target.reset(); // Limpiamos las cajas de texto
      })
      .catch(() => {
        Swal.fire({
          title: '¡Ups!',
          text: 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#E6007E' 
        });
      })
      .finally(() => {
        setEnviando(false); // Devolvemos el botón a la normalidad
      });
  };

  return (
    <section id="contacto" className="seccion-contacto">
      <div className="contacto-contenedor">
        <h2>Cotiza tu Proyecto</h2>
        <p>¿Tienes un diseño en mente? Déjanos tus datos y hagámoslo realidad con MatSof.</p>
        
        {/* Conectamos la función manejarEnvio al formulario */}
        <form id="formulario-cotizacion" className="formulario" onSubmit={manejarEnvio}>
          <div className="grupo-input">
            <input type="text" id="nombre" placeholder="Tu Nombre Completo" required />
          </div>
          <div className="grupo-input">
            <input type="email" id="correo" placeholder="Tu Correo Electrónico" required />
          </div>
          <div className="grupo-input">
            <select id="servicio" required defaultValue="">
              <option value="" disabled>¿Qué te interesa?</option>
              <option value="polos">Impresión de Polos</option>
              <option value="tazas">Tazas Personalizadas</option>
              <option value="termos">Termos Personalizados</option>
              <option value="otro">Otro / Paquete Corporativo</option>
            </select>
          </div>
          <div className="grupo-input">
            <textarea id="mensaje" rows="4" placeholder="Cuéntanos los detalles (Cantidades, colores, fechas...)" required></textarea>
          </div>
          
          {/* El botón cambia dependiendo del estado 'enviando' */}
          <button type="submit" className="btn-primary btn-enviar" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Cotización'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contacto;