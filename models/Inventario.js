const mongoose = require('mongoose');
//definir esquema
const inventarioSchema = new mongoose.Schema({
    //nombreproducto: type: String
    nombreproducto: String,
    descripcion: String,
    cantidades: Number,
    precio: Number,
    usuario: String
    
});

const InventarioModel = mongoose.model('Inventario' ,inventarioSchema, 'inventario');
module.exports = InventarioModel;