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

//obtener el producto con la mayor cantidad en stock:
rutas.get('/maximo', async (req, res) => {
    try {
      const productoMaximo = await InventarioModel.findOne().sort({ cantidades: -1 }).limit(1);
      res.json(productoMaximo);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  });
  //obtener el producto con la menor cantidad en stock:
  rutas.get('/minimo', async (req, res) => {
    try {
      const productoMinimo = await InventarioModel.findOne().sort({ cantidades: 1 }).limit(1);
      res.json(productoMinimo);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  });

  //obtener la suma total de todas las cantidades en el inventario:
  rutas.get('/total', async (req, res) => {
    try {
      const totalCantidades = await InventarioModel.aggregate([
        { $group: { _id: null, total: { $sum: '$cantidades' } } }
      ]);
      res.json({ total: totalCantidades[0].total });
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  });

  //obtener productos por rango de cantidades:
rutas.get('/rango/:min/:max', async (req, res) => {
  try {
    const productos = await InventarioModel.find({
      cantidades: { $gte: req.params.min, $lte: req.params.max }
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});
//obtener productos por palabra clave en el nombre o descripción:
rutas.get('/buscar/:keyword', async (req, res) => {
    try {
      const productos = await InventarioModel.find({
        $or: [
          { nombreproducto: { $regex: req.params.keyword, $options: 'i' } },
          { descripcion: { $regex: req.params.keyword, $options: 'i' } }
        ]
      });
      res.json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  });
module.exports = rutas;