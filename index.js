const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

//rutas
const inventarioRutas = require('./rutas/inventarioRutas');

//configuraciones de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

//manejo de JSON
app.use(express.json());

//CONEXION CON MONGODB
mongoose.connect(MONGO_URI)
.then(() => {
        console.log('Conexion exitosa');
        app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto: "+PORT)})
    }
).catch( error => console.log('error de conexion', error));


//utilizar las rutas de inventario
app.use('/inventarios', inventarioRutas);