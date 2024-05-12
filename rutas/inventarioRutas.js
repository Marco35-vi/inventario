const express = require('express');
const rutas = express.Router();
const InventarioModel = require('../models/Inventario');

//endpoint traer los productos
rutas.get('/traerInventario', async (req, res) => {
    try {
        const inventario = await InventarioModel.find();
        res.json(inventario);
    } catch (error){
        res.status(500).json({mensaje: error.mensaje});
    }
});
module.exports = rutas;