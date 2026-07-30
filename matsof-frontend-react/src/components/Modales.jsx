import React from 'react';
import Swal from 'sweetalert2';

const URL_BACKEND = 'https://matsof-react.onrender.com/api';

function Modales({ modalActivo, setModalActivo, setUsuario }) {
  // Si no hay ningún modal activo, le decimos a React que no dibuje nada (null)
  if (!modalActivo) return null;

  const cerrar = () => setModalActivo(null);

  // --- LÓGICA DE LOGIN ---
  const manejarLogin = async (e) => {
    e.preventDefault();
    const email = e.target['login-email'].value;
    const password = e.target['login-password'].value;

    try {
      const respuesta = await fetch(`${URL_BACKEND}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await respuesta.json();

      if (respuesta.ok) {
        Swal.fire('¡Bienvenido!', `Qué gusto verte de nuevo, ${data.usuario.nombre}`, 'success');
        localStorage.setItem('usuarioMatSof', JSON.stringify(data.usuario));
        setUsuario(data.usuario); // Le avisamos a toda la aplicación quién entró
        cerrar(); // Cerramos la ventana
      } else {
        Swal.fire('Acceso Denegado', data.mensaje, 'error');
      }
    } catch (error) {
      Swal.fire('Error de Red', 'Asegúrate de que el servidor Backend esté encendido.', 'error');
    }
  };

 
  // --- LÓGICA DE REGISTRO ---
  const manejarRegistro = async (e) => {
    e.preventDefault();
    const nombre = e.target['registro-nombre'].value;
    const email = e.target['registro-email'].value;
    const password = e.target['registro-password'].value;

    try {
      const respuesta = await fetch(`${URL_BACKEND}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });
      const data = await respuesta.json();

      if (respuesta.ok) {
        // 1. Limpiamos las cajas de texto que escribió el usuario
        e.target.reset(); 
        
        // 2. Cerramos el modal de registro INMEDIATAMENTE
        cerrar(); 
        
        // 3. Mostramos el mensaje de éxito
        await Swal.fire('¡Éxito!', data.mensaje, 'success');
        
        // 4. Abrimos automáticamente la ventana de login
        setModalActivo('login'); 
      } else {
        Swal.fire('Aviso', data.mensaje, 'warning');
      }
    } catch (error) {
      Swal.fire('Error de Red', 'Asegúrate de que el servidor Backend esté encendido.', 'error');
    }
  };

  return (
    <>
      {/* Fondo Oscuro */}
      <div className="overlay" onClick={cerrar}></div>

      {/* Modal de Login (Solo se dibuja si el estado es 'login') */}
      {modalActivo === 'login' && (
        <div className="caja-modal">
          <button type="button" className="btn-cerrar-modal" onClick={cerrar}>
            <i className="fas fa-times"></i>
          </button>
          <h2>Inicia Sesión</h2>
          <p>Bienvenido de vuelta a MatSof.</p>
          <form className="formulario" onSubmit={manejarLogin}>
            <div className="grupo-input">
              <input type="email" id="login-email" placeholder="Correo electrónico" required />
            </div>
            <div className="grupo-input">
              <input type="password" id="login-password" placeholder="Contraseña" required />
            </div>
            <button type="submit" className="btn-enviar">Entrar</button>
          </form>
        </div>
      )}

      {/* Modal de Registro (Solo se dibuja si el estado es 'registro') */}
      {modalActivo === 'registro' && (
        <div className="caja-modal">
          <button type="button" className="btn-cerrar-modal" onClick={cerrar}>
            <i className="fas fa-times"></i>
          </button>
          <h2>Crea tu cuenta</h2>
          <p>Únete para guardar tus diseños y pedidos.</p>
          <form className="formulario" onSubmit={manejarRegistro}>
            <div className="grupo-input">
              <input type="text" id="registro-nombre" placeholder="Nombre completo" required />
            </div>
            <div className="grupo-input">
              <input type="email" id="registro-email" placeholder="Correo electrónico" required />
            </div>
            <div className="grupo-input">
              <input type="password" id="registro-password" placeholder="Crea una contraseña" required />
            </div>
            <button type="submit" className="btn-enviar">Registrarme</button>
          </form>
        </div>
      )}
    </>
  );
}

export default Modales;