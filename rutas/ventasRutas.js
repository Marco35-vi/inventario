const express = require('express');
const rutas = express.Router();
const Venta = require('../models/Venta');
const Inventario = require('../models/Inventario');
const Usuario = require('../models/Usuario');

// Crear una nueva venta
rutas.post('/', async (req, res) => {
    try {
        const { usuarioId, productos } = req.body;
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        let total = 0;
        for (const item of productos) {
            const inventario = await Inventario.findById(item.inventario);
            if (!inventario) {
                return res.status(404).json({ mensaje: `Producto no encontrado en inventario: ${item.inventario}` });
            }

            if (inventario.cantidades < item.cantidad) {
                return res.status(400).json({ mensaje: `Cantidad insuficiente para el producto: ${inventario.nombre}` });
            }

            inventario.cantidades -= item.cantidad;
            await inventario.save();

            total += inventario.precio * item.cantidad;

            if (inventario.cantidades === 0) {
                console.log(`Producto ${inventario.nombre} agotado.`);
            }
        }

        if (isNaN(total)) {
            return res.status(400).json({ mensaje: 'Error en el cálculo del total' });
        }

        const nuevaVenta = new Venta({
            usuario: usuarioId,
            productos,
            total
        });

        await nuevaVenta.save();
        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Leer todas las ventas
rutas.get('/', async (req, res) => {
    try {
        const ventas = await Venta.find().populate('usuario').populate('productos.inventario');
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Leer una venta por ID
rutas.get('/:id', async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id).populate('usuario').populate('productos.inventario');
        if (!venta) {
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Actualizar una venta por ID
rutas.put('/:id', async (req, res) => {
    try {
        const { productos } = req.body;
        let total = 0;
        for (const item of productos) {
            const inventario = await Inventario.findById(item.inventario);
            if (!inventario) {
                return res.status(404).json({ mensaje: `Producto no encontrado en inventario: ${item.inventario}` });
            }
            total += inventario.precio * item.cantidad;
        }

        if (isNaN(total)) {
            return res.status(400).json({ mensaje: 'Error en el cálculo del total' });
        }

        const ventaActualizada = await Venta.findByIdAndUpdate(req.params.id, {
            productos,
            total
        }, { new: true }).populate('usuario').populate('productos.inventario');

        if (!ventaActualizada) {
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }
        res.status(200).json(ventaActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Eliminar una venta por ID
rutas.delete('/:id', async (req, res) => {
    try {
        const ventaEliminada = await Venta.findByIdAndDelete(req.params.id);
        if (!ventaEliminada) {
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }
        res.status(200).json({ mensaje: 'Venta eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Obtener ventas por usuario
rutas.get('/reportes/ventas-por-usuario/:usuarioId', async (req, res) => {
    try {
        const ventas = await Venta.find({ usuario: req.params.usuarioId }).populate('productos.inventario');
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Obtener ventas por inventario
rutas.get('/reportes/ventas-por-inventario/:inventarioId', async (req, res) => {
    try {
        const ventas = await Venta.find({ 'productos.inventario': req.params.inventarioId }).populate('usuario').populate('productos.inventario');
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = rutas;
