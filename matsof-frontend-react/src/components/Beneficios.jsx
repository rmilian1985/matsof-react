import React from 'react';

function Beneficios() {
  return (
    <section className="beneficios">
      <div className="beneficio" data-aos="fade-up" data-aos-delay="100">
        <span className="icono">🚀</span>
        <h3>Producción Rápida</h3>
        <p>Tus pedidos listos en tiempo récord para que no pares de vender.</p>
      </div>
      
      <div className="beneficio" data-aos="fade-up" data-aos-delay="200">
        <span className="icono">💎</span>
        <h3>Calidad Premium</h3>
        <p>Tecnología DTF que garantiza colores vibrantes y máxima durabilidad.</p>
      </div>
      
      <div className="beneficio" data-aos="fade-up" data-aos-delay="300">
        <span className="icono">📦</span>
        <h3>Sin Mínimos</h3>
        <p>Imprimimos tu marca desde 1 sola unidad hasta grandes lotes.</p>
      </div>
    </section>
  );
}

export default Beneficios;