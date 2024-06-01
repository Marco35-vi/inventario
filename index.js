const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas');
const Usuario = require('./models/Usuario');
const ventasRutas = require('./rutas/ventasRutas');
const Venta = require('./models/Venta');
require('dotenv').config();

const app = express();

// Rutas
const inventarioRutas = require('./rutas/inventarioRutas');

// Configuraciones de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Manejo de JSON
app.use(express.json());
const corsOptions = {
    origin:['http://localhost:4200','http://localhost:4200/', '*'],
    // methods: 'GET,POST,PUT,DELETE',
    optionsSuccessStatus:200,
    credentials: true
}
app.use(cors(corsOptions))
// CONEXION CON MONGODB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conexión exitosa');
        app.listen(PORT, () => { console.log("Servidor express corriendo en el puerto: " + PORT) });
    })
    .catch(error => console.log('Error de conexión', error));

// Middleware de autenticación
const autenticar = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ mensaje: 'No existe el token de autenticación' });
        }
        const decodificar = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decodificar.usuarioId);

        if (!usuario || usuario.token !== token) {
            return res.status(401).json({ mensaje: 'Usuario no autorizado' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// app.use('/auth', authRutas);
// app.use('/inventarios', autenticar, inventarioRutas);
// app.use('/ventas', autenticar, ventasRutas);

//utilizar las rutas de inventario
app.use('/inventarios', inventarioRutas);
app.use('/ventas', ventasRutas);
