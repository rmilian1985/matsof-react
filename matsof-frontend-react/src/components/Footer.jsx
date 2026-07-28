import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        
        <div className="footer-columna">
          <h3>MatSof.</h3>
          <p>Personaliza tu estilo, crea tu marca con la mejor calidad en impresión DTF y sublimación.</p>
        </div>
        
        <div className="footer-columna">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="#productos">Catálogo</a></li>
            <li><a href="#contacto">Cotizar</a></li>
          </ul>
        </div>
        
        <div className="footer-columna">
          <h4>Contáctanos</h4>
          <p>📍 San Juan de Miraflores, Lima</p>
          <p>📱 +51983400330</p>
          <p>✉️ hola@matsof.com</p>
        </div>

      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 MatSof. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;