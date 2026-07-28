import React, { useState, useEffect } from 'react';

// Guardamos nuestras escenas fuera de la función principal
const escenasHero = [
  {
    titulo: <>Transforma tus ideas en <span className="texto-cmyk">productos increíbles</span></>,
    imagen: "/termo-1.jpg", 
    fondo: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" 
  },
  {
    titulo: <>Polos DTF Premium con <span style={{ color: 'var(--cmyk-cyan)' }}>colores vibrantes</span></>,
    imagen: "/polo-negro.jpg", 
    fondo: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)" 
  },
  {
    titulo: <>Tazas Personalizadas <span style={{ color: 'var(--cmyk-magenta)' }}>que enamoran</span></>,
    imagen: "/taza-blanca-1.jpg", 
    fondo: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)" 
  }
];

function Hero() {
  // Estas dos variables mágicas controlan la escena actual y la animación
  const [escenaActual, setEscenaActual] = useState(0);
  const [fade, setFade] = useState(false);

  // useEffect se encarga de ejecutar el temporizador
  useEffect(() => {
    const temporizador = setInterval(() => {
      setFade(true); // Iniciamos el efecto de desvanecimiento
      
      setTimeout(() => {
        // Pasamos a la siguiente escena
        setEscenaActual((prev) => (prev + 1) % escenasHero.length);
        setFade(false); // Quitamos el desvanecimiento para que aparezca
      }, 500);
      
    }, 4000);

    return () => clearInterval(temporizador); // Limpieza de seguridad
  }, []);

  const escena = escenasHero[escenaActual];

  return (
    <header className="hero" style={{ background: escena.fondo }}>
      <div className="hero-contenido" data-aos="fade-right" data-aos-duration="1000">
        {/* Usamos el estado 'fade' para agregar la clase CSS de ocultar */}
        <h1 className={fade ? 'fade-out' : ''}>{escena.titulo}</h1>
        <p>Impresión DTF y Sublimación de alta calidad para emprendedores y marcas. Sin pedidos mínimos, con acabados premium y colores vibrantes.</p>
        <div className="hero-botones">
          <a href="#productos" className="btn-primario">Ver Catálogo</a>
          <a href="#contacto" className="btn-secundario">Cotizar ahora</a>
        </div>
      </div>
      
      <div className="hero-imagen" data-aos="fade-left" data-aos-duration="1200">
        <img 
          src={escena.imagen} 
          alt="Muestra de productos MatSof" 
          className={fade ? 'fade-out' : ''} 
        />
      </div>
    </header>
  );
}

export default Hero;