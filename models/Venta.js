const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        inventario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventario',
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const Venta = mongoose.model('Venta', ventaSchema, 'ventaproductos'); 
module.exports = Venta; 

