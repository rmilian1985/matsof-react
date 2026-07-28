import React from 'react';

function Nosotros() {
  return (
    /* Aumentamos el paddingTop a 140px y agregamos minHeight: 100vh */
    <section id="nosotros" style={{ paddingTop: '140px', paddingBottom: '80px', paddingLeft: '5%', paddingRight: '5%', backgroundColor: '#fafbfc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Columna Izquierda (Textos y Checkmarks) */}
        <div style={{ flex: '1', minWidth: '300px' }} data-aos="fade-right" data-aos-duration="1000">
          <h1 style={{ fontSize: '3.5rem', color: '#1a1a1a', marginBottom: '20px', lineHeight: '1.2' }}>
            La Historia detrás de <br/>
            <span style={{ color: 'var(--cmyk-cyan)' }}>MatSof</span>
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '20px' }}>
            Nacimos en San Juan de Miraflores con una misión clara: ayudar a emprendedores y empresas a plasmar su identidad visual con la más alta calidad.
          </p>
          
          <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '30px' }}>
            Nos especializamos en tecnología <strong>DTF (Direct to Film)</strong> y sublimación, lo que nos permite estampar diseños a todo color, con una durabilidad extrema y sobre cualquier tipo de tela. No somos solo impresores, somos tus socios creativos.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem', color: '#222' }}>
            <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#28a745', fontSize: '1.2rem' }}>✅</span> 
              <strong>Calidad fotográfica en cada prenda.</strong>
            </li>
            <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#28a745', fontSize: '1.2rem' }}>✅</span> 
              <strong>Entregas puntuales y responsables.</strong>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#28a745', fontSize: '1.2rem' }}>✅</span> 
              <strong>Atención 100% personalizada.</strong>
            </li>
          </ul>
        </div>

        {/* Columna Derecha (Imagen de la máquina) */}
        <div style={{ flex: '1', minWidth: '300px', textAlign: 'center' }} data-aos="fade-left" data-aos-duration="1200">
          <div style={{ 
            backgroundColor: '#f1f3f5', 
            borderRadius: '15px', 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)' 
          }}>
            {/* Si tienes la foto real de la máquina, puedes cambiar este div por la etiqueta <img> */}
            <span style={{ color: '#6c757d', fontSize: '1.2rem' }}>Nuestra Máquina DTF</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Nosotros;