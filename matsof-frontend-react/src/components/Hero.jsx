import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
//import { useEffect } from 'react';

// 1. Agregamos la propiedad 'descripcion' a cada escena
const escenasHero = [
  {
    titulo: <>Transforma tus ideas en <span className="texto-cmyk">productos increíbles</span></>,
    descripcion: "Impresión DTF y Sublimación de alta calidad para emprendedores y marcas. Sin pedidos mínimos, con acabados premium y colores vibrantes.",
    imagen: "/termo-1.jpg", 
    fondo: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" 
  },
  {
    titulo: <>Polos DTF Premium con <span style={{ color: 'var(--cmyk-cyan)' }}>colores vibrantes</span></>,
    descripcion: "Estampados de máxima durabilidad que no se cuartean ni pierden color. Calidad fotográfica sobre algodón 100% para tu marca o eventos.",
    imagen: "/polo-negro.jpg", 
    fondo: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)" 
  },
  {
    titulo: <>Tazas Personalizadas <span style={{ color: 'var(--cmyk-magenta)' }}>que enamoran</span></>,
    descripcion: "El detalle perfecto para regalos o merchandising corporativo. Diseños brillantes y resistentes al microondas, creados a tu medida desde 1 unidad.",
    imagen: "/taza-blanca-1.jpg", 
    fondo: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)" 
  }
];

function Hero() {
  const [escenaActual, setEscenaActual] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const temporizador = setInterval(() => {
      setFade(true); // Inicia el desvanecimiento
      
      setTimeout(() => {
        setEscenaActual((prev) => (prev + 1) % escenasHero.length);
        setFade(false); // Inicia la aparición con el nuevo contenido
      }, 500);
      
    }, 4000);

    return () => clearInterval(temporizador);
  }, []);

  const escena = escenasHero[escenaActual];

  // 2. LA MAGIA DE REACT: Creamos un estilo dinámico que reacciona al estado 'fade'
  const estiloTransicion = {
    opacity: fade ? 0 : 1, // Se oculta o se muestra
    transform: fade ? 'translateY(15px)' : 'translateY(0)', // Baja 15px o regresa a su lugar
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out', // Suavidad del movimiento
  };

  useEffect(() => {
    // 1. Preguntamos a la memoria del navegador si ya mostramos la promo antes
    const promoYaVista = localStorage.getItem('promoMatSof');

    // 2. Si no la ha visto (!promoYaVista), disparamos la alerta
    if (!promoYaVista) {
      
      // Swal.fire es una función asíncrona que devuelve una Promesa
      Swal.fire({
        title: '¡Bienvenido a MatSof!',
        html: 'Llévate un <strong>10% de descuento</strong> en tu primera compra de Tazas o Polos DTF.',
        imageUrl: '/taza-blanca-1.jpg', // Usamos una de tus fotos
        imageWidth: 250,
        imageAlt: 'Regalo de Bienvenida',
        confirmButtonText: '¡Quiero mi descuento! 🎉',
        confirmButtonColor: '#e0007b', // Color Magenta de tu marca
        showCancelButton: true,
        cancelButtonText: 'Quizás luego',
        cancelButtonColor: '#6c757d',
        background: '#ffffff',
        backdrop: `rgba(0,0,0,0.6)` // Oscurece el fondo
      }).then((resultado) => {
        
        // 3. Esta función (.then) se ejecuta CUANDO el usuario hace clic
        if (resultado.isConfirmed) {
          Swal.fire({
            title: '¡Código Activado!',
            text: 'Menciona el código MATSOF-VIP al enviar tu pedido por WhatsApp.',
            icon: 'success',
            confirmButtonColor: '#00aeee' // Color Cyan de tu marca
          });
        }
      });

      // 4. Guardamos en la memoria que este usuario ya vio la alerta
      // Así, si recarga la página mañana, ya no lo interrumpimos
      localStorage.setItem('promoMatSof', 'true');
    }
  }, []);

  return (
    // Agregamos una transición suave al fondo para que los colores cambien de forma fluida
    <header className="hero" style={{ background: escena.fondo, transition: 'background 1s ease-in-out' }}>
      
      <div className="hero-contenido">
        
        {/* El contenedor exterior mantiene AOS para la primera vez que entras a la página */}
        <div data-aos="fade-right" data-aos-duration="1000">
          
          {/* Los elementos interiores usan el estiloTransicion para animarse CADA 4 SEGUNDOS */}
          <h1 style={{ ...estiloTransicion, margin: 0 }}>
            {escena.titulo}
          </h1>
          
          {/* Le damos un pequeñísimo retraso (delay) a la descripción y botones para mantener el efecto escalera */}
          <p style={{ ...estiloTransicion, transitionDelay: '100ms' }}>
            {escena.descripcion}
          </p>
          
          <div className="hero-botones" style={{ ...estiloTransicion, transitionDelay: '200ms' }}>
            <a href="#productos" className="btn-primario">Ver Catálogo</a>
            <a href="#contacto" className="btn-secundario">Cotizar ahora</a>
          </div>

        </div>
      </div>
      
      <div className="hero-imagen" data-aos="fade-left" data-aos-duration="1200">
        <img 
          src={escena.imagen} 
          alt="Muestra de productos MatSof" 
          style={estiloTransicion} 
        />
      </div>

    </header>
  );
}

export default Hero;