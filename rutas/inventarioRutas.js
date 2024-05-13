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
//endpoint 2. Añadir
rutas.post('/agregar', async (req, res) => {
    const inventario = new InventarioModel({
        nombreproducto: req.body.nombreproducto,
        descripcion: req.body.descripcion,
        cantidades: req.body.cantidades
    })
    try {
        const nuevoInventario = await inventario.save();
        res.status(201).json(nuevoInventario);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//endpoint 3. Editar
rutas.put('/editar/:id', async (req, res) => {
    try {
        const inventarioEditado = await InventarioModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!inventarioEditado)
            return res.status(404).json({ mensaje : 'Producto no encontrado!!!'});
        else
            return res.status(201).json(inventarioEditado);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
})
//ENDPOINT 4. eliminar
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const productoEliminado = await InventarioModel.findByIdAndDelete(req.params.id);
       if (!productoEliminado)
            return res.status(404).json({ mensaje : 'producto no encontrado!!!'});
       else 
            return res.json({mensaje :  'producto eliminado'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
module.exports = rutas;