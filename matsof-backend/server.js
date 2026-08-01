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
// 4. MODELO DE USUARIO (Nivel PRO: Con Carrito e Historial)
// ==========================================
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // El carrito (es temporal, se borra al comprar)
  carrito: [
    {
      productoId: { type: String, required: true },
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, default: 1 },
      variante: { type: String, default: 'Estándar' } 
    }
  ],

  // NUEVO: El Historial (es eterno, guarda todo lo que compró)
  historialPedidos: [
    {
      fecha: { type: Date, default: Date.now }, // Guarda la fecha y hora exacta
      totalPagado: { type: Number },            // Cuánto costó todo el pedido
      productos: []                             // Aquí copiaremos la lista del carrito
    }
  ]
}, { timestamps: true }); 

const Usuario = mongoose.model('Usuario', usuarioSchema);

// ==========================================
// 4.5 MODELO DE PRODUCTO (El Catálogo)
// ==========================================
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String, required: true },
  categoria: { type: String, default: 'General' }
});

const Producto = mongoose.model('Producto', productoSchema);

// ==========================================
// 5. RUTAS DEL BACKEND (API)
// ==========================================

// Ruta: CREAR un nuevo producto (Solo Administrador)
app.post('/api/productos', async (req, res) => {
  try {
    // 1. Tomamos los datos que nos envías (nombre, precio, imagen)
    const datosProducto = req.body;

    // 2. Usamos el molde para fabricar el producto
    const nuevoProducto = new Producto(datosProducto);

    // 3. Lo guardamos en la bóveda de MongoDB
    await nuevoProducto.save();

    res.status(201).json({ 
      mensaje: '¡Producto creado exitosamente en el catálogo!', 
      producto: nuevoProducto 
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ mensaje: 'Error al crear el producto.', detalles: error.message });
  }
});

// Ruta: LEER todos los productos (Para mostrar en el Frontend)
app.get('/api/productos', async (req, res) => {
  try {
    // Busca TODOS los productos en la colección de MongoDB
    const todosLosProductos = await Producto.find();
    
    // Se los envía a tu página de React
    res.status(200).json(todosLosProductos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el catálogo.' });
  }
});

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

// Ruta C: Agregar un producto al carrito del usuario
app.post('/api/carrito', async (req, res) => {
  try {
    // 1. Recibimos los nuevos datos desde la página web
    const { email, productoId, nombre, precio, cantidad, variante } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // 2. Empujamos todo (incluyendo cantidad y variante) a su mochila
    usuario.carrito.push({
      productoId,
      nombre,
      precio,
      cantidad: cantidad || 1,          // Si no envían cantidad, por defecto es 1
      variante: variante || 'Estándar'  // Si no envían talla, por defecto es Estándar
    });

    await usuario.save();
    res.status(200).json({ mensaje: '¡Producto agregado con éxito!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Hubo un error al guardar el producto.' });
  }
});

// Ruta D: Obtener todos los productos del carrito de un usuario
app.get('/api/carrito/:email', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.params.email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }
    
    // Le enviamos al Frontend la lista exacta de su mochila
    res.status(200).json(usuario.carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el carrito.' });
  }
});

// Ruta E: Eliminar un producto específico del carrito
app.delete('/api/carrito', async (req, res) => {
  try {
    const { email, idProductoCarrito } = req.body;
    
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Nivel PRO: Mongoose le asigna un "_id" único a cada producto dentro del carrito automáticamente.
    // Usamos filter() para decirle a MongoDB: "Quédate con todos, EXCEPTO con el que tenga este _id".
    usuario.carrito = usuario.carrito.filter(item => item._id.toString() !== idProductoCarrito);
    
    await usuario.save(); // Guardamos la mochila actualizada
    res.status(200).json({ mensaje: 'Producto eliminado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto.' });
  }
});

// Ruta F: Guardar en Historial y Vaciar el carrito
app.delete('/api/carrito/vaciar', async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // 1. Solo guardamos en historial si hay algo en el carrito
    if (usuario.carrito.length > 0) {
      
      // Calculamos cuánto fue el total de todo ese carrito
      const total = usuario.carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);

      // 2. Copiamos los productos del carrito y los guardamos en el Historial
      usuario.historialPedidos.push({
        fecha: new Date(),
        totalPagado: total,
        productos: [...usuario.carrito] // Los tres puntitos (...) copian el arreglo exacto
      });
    }

    // 3. Ahora sí, vaciamos el carrito dejándolo listo para la siguiente compra
    usuario.carrito = [];
    
    await usuario.save(); // Guardamos todos los cambios en MongoDB
    res.status(200).json({ mensaje: 'Pedido guardado en historial y carrito vaciado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar el pedido.' });
  }
});

// ==========================================
// 6. ENCENDER EL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`💻 Servidor Backend corriendo en http://localhost:${PORT}`);
});