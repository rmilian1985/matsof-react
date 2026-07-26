// ==========================================
// 1. IMPORTAR LIBRERÍAS
// ==========================================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Nivel PRO: Para encriptar contraseñas

// ==========================================
// 2. INICIALIZAR EL SERVIDOR
// ==========================================
const app = express();

app.use(cors()); 
app.use(express.json()); 

// ==========================================
// 3. CONECTAR A LA BASE DE DATOS (MongoDB)
// ==========================================
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => console.log('✅ ¡Conectado exitosamente a la Base de Datos MongoDB Atlas! 🚀'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// ==========================================
// 4. MODELO DE USUARIO (Cómo se guarda en la BD)
// ==========================================
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // unique evita correos repetidos
  password: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// ==========================================
// 5. RUTAS DEL BACKEND (API)
// ==========================================

// Ruta A: Registrar un nuevo usuario
app.post('/api/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // 1. Verificar si el correo ya existe en la base de datos
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Error: El correo ya está registrado.' });
    }

    // 2. Encriptar la contraseña para que no se vea el texto real
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // 3. Guardar el nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordEncriptada
    });
    
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: '¡Usuario registrado con éxito!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Hubo un error en el servidor.' });
  }
});

// Ruta B: Iniciar Sesión (Login)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    // 2. Comparar la contraseña escrita con la encriptada en la BD
    const esPasswordValida = await bcrypt.compare(password, usuario.password);
    if (!esPasswordValida) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    // 3. Si todo está correcto, damos la bienvenida enviando sus datos
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Hubo un error en el servidor.' });
  }
});

// ==========================================
// 6. ENCENDER EL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`💻 Servidor Backend corriendo en http://localhost:${PORT}`);
});