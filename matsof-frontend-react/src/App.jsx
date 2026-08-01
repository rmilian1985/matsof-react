import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Beneficios from './components/Beneficios';
import Nosotros from './components/Nosotros';
import Catalogo from './components/Catalogo';
import Contacto from './components/Contacto';
import Footer from './components/Footer';
import Modales from './components/Modales';
import CarritoFlotante from './components/CarritoFlotante';
import AOS from 'aos';
import 'aos/dist/aos.css'; // ¡Muy importante importar los estilos!
import { useEffect } from 'react'; // El Hook maestro de React

function App() {
  const [modalActivo, setModalActivo] = useState(null);
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuarioMatSof');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [actualizadorCarrito, setActualizadorCarrito] = useState(0);
  const notificarCarrito = () => setActualizadorCarrito(prev => prev + 1);

  const [vistaActual, setVistaActual] = useState('inicio'); 

  // Encendemos AOS cuando la aplicación carga
  useEffect(() => {
    AOS.init({
      duration: 1000, // La animación dura 1 segundo
      once: true,     // Si el usuario sube y baja, no se vuelve a animar (se ve más profesional)
      easing: 'ease-out-cubic', // El tipo de curva matemática del movimiento
    });
  }, []); // Los corchetes vacíos [] significan "Ejecuta esto SOLO UNA VEZ al inicio"
  
  return (
    <div>
      <Navbar 
        setModalActivo={setModalActivo} 
        usuario={usuario} 
        setUsuario={setUsuario} 
        setVistaActual={setVistaActual} 
      />
      
      {/* CONDICIONAL: ¿Qué vista mostramos? */}
      {vistaActual === 'inicio' ? (
        <>
          <Hero />
          <Beneficios />
          <Catalogo 
            usuario={usuario} 
            setModalActivo={setModalActivo} 
            notificarCarrito={notificarCarrito} 
          />
          {/* MOVIMOS EL CONTACTO AQUÍ ADENTRO */}
          <Contacto /> 
        </>
      ) : (
        /* Si estamos en "nosotros", solo cargamos esto y el contacto desaparece */
        <Nosotros />
      )}
      
      {/* El Footer siempre visible al final */}
      <Footer />
      <Modales modalActivo={modalActivo} setModalActivo={setModalActivo} setUsuario={setUsuario} />
      
      <CarritoFlotante 
        usuario={usuario} 
        setModalActivo={setModalActivo} 
        actualizador={actualizadorCarrito} 
      />
    </div>
  );
}

export default App;