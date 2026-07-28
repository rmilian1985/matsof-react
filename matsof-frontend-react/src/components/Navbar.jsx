import React, { useState } from 'react';
import Swal from 'sweetalert2';

// Traemos los productos aquí también para que el buscador pueda leerlos
const productos = [
  { id: 1, nombre: "Polo Orgullo Peruano DTF", categoria: "Polos", precio: "S/ 45.00", imagen: "/polo-blanco.jpg" },
  { id: 2, nombre: "Taza Mágica Corporativa", categoria: "Tazas", precio: "S/ 25.00", imagen: "/taza-blanca-1.jpg" },
  { id: 3, nombre: "Termo Digital 500ml", categoria: "Termos", precio: "S/ 55.00", imagen: "/termo-1.jpg" },
  { id: 4, nombre: "Polo Personalizado Logo", categoria: "Polos", precio: "S/ 50.00", imagen: "/polo-negro.jpg" }
];

// 1. CAMBIO AQUÍ: Agregamos setVistaActual en esta línea
function Navbar({ setModalActivo, usuario, setUsuario, setVistaActual }) {
  // Estados para el Buscador y la Región
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [region, setRegion] = useState('ES / PEN');

  // --- 1. LÓGICA DEL BUSCADOR ---
  const productosFiltrados = textoBusqueda.trim() === '' 
    ? [] 
    : productos.filter(p => 
        p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) || 
        p.categoria.toLowerCase().includes(textoBusqueda.toLowerCase())
      );

  // --- 2. LÓGICA DE LA REGIÓN (MONEDA) ---
  const cambiarRegion = async (e) => {
    e.preventDefault();
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: 'Configuración Regional',
      html: `
        <div style="text-align: left; font-size: 14px; margin-top: 15px;">
          <label style="display:block; margin-bottom: 8px; font-weight: bold; color: var(--cmyk-cyan);">Selecciona tu moneda:</label>
          <select id="swal-moneda" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; outline: none; cursor: pointer;">
            <option value="PEN">🇵🇪 Perú (PEN - S/)</option>
            <option value="USD">🇺🇸 Estados Unidos (USD - $)</option>
            <option value="EUR">🇪🇺 Europa (EUR - €)</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#00AEEF',
      preConfirm: () => {
        const select = document.getElementById('swal-moneda');
        return {
          moneda: select.value,
          texto: select.options[select.selectedIndex].text
        }
      }
    });

    if (isConfirmed) {
      const bandera = formValues.texto.split(' ')[0]; 
      setRegion(`${bandera} ${formValues.moneda}`); // Actualizamos el botón visualmente
      Swal.fire({ position: 'top-end', icon: 'success', title: `Moneda actualizada a ${formValues.moneda}`, showConfirmButton: false, timer: 1500, toast: true });
    }
  };

  const cerrarSesion = (e) => {
    e.preventDefault();
    localStorage.removeItem('usuarioMatSof'); 
    setUsuario(null); 
  };

  return (
    <header className="header-principal">
      <div className="navbar-top">
        <div className="navbar-izq">
          <a href="/">
            <img src="/logo.png" alt="MatSof Logo" className="logo-img" />
          </a>
        </div>

        {/* --- BUSCADOR CON CAJA FLOTANTE --- */}
        <div className="navbar-centro">
          <div className="contenedor-buscador" style={{ position: 'relative' }}>
            <div className="caja-buscador">
              <input 
                type="text" 
                placeholder="Buscar polos, tazas..." 
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
              />
              <button type="button" className="btn-buscar">
                <i className="fas fa-search"></i>
              </button>
            </div>

            {/* Resultados Flotantes */}
            {textoBusqueda.trim() !== '' && (
              <div id="resultados-busqueda" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', zIndex: 1000, borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map(prod => (
                    <div 
                      key={prod.id} 
                      className="resultado-item" 
                      onClick={() => {
                        setTextoBusqueda(''); // Limpiamos el buscador
                        setVistaActual('inicio'); // Nos aseguramos de estar en la pantalla principal
                        setTimeout(() => window.location.href = '#productos', 100); // Lo mandamos al catálogo
                      }}
                      style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                    >
                      <img src={prod.imagen} alt={prod.nombre} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#333' }}>{prod.nombre}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--cmyk-cyan)' }}>{prod.precio}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '15px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                    No se encontraron productos
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="navbar-der">
          {/* --- BOTÓN DE REGIÓN CONECTADO --- */}
          <a href="#" className="icono-texto" onClick={cambiarRegion}>
            <i className="fas fa-globe"></i> {region}
          </a>
          
          {usuario ? (
            <>
              <a href="#" className="icono-texto" style={{ color: 'var(--cmyk-cyan)' }} onClick={(e) => {
                e.preventDefault();
                Swal.fire('Mi Perfil', 'Próximamente podrás ver tu historial de pedidos aquí.', 'info');
              }}>
                <i className="fas fa-user-circle"></i> Hola, {usuario.nombre.split(' ')[0]}
              </a>
              <button className="btn-registro" style={{ backgroundColor: '#dc3545' }} onClick={cerrarSesion}>
                Salir
              </button>
            </>
          ) : (
            <>
              <a href="#" className="icono-texto" onClick={(e) => { e.preventDefault(); setModalActivo('login'); }}>
                <i className="fas fa-user"></i> Entrar
              </a>
              <button className="btn-registro" onClick={() => setModalActivo('registro')}>
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>

     <nav className="navbar-bottom">
        <ul className="menu-enlaces">
          <li>
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              setVistaActual('inicio'); 
              window.scrollTo(0, 0); // FORZAMOS A SUBIR DEL TODO
            }}>
              Inicio
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              setVistaActual('nosotros'); 
              window.scrollTo(0, 0); // FORZAMOS A SUBIR DEL TODO
            }}>
              Nosotros
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              setVistaActual('inicio'); 
              setTimeout(() => window.location.href = '#productos', 100); 
            }}>
              Catálogo
            </a>
          </li>
          <li>
            <a href="#contacto" onClick={() => setVistaActual('inicio')}>
              Cotizar
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;