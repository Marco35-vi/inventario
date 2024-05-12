const mongoose = require('mongoose');
//definir esquema
const inventarioSchema = new mongoose.Schema({
    //nombreproducto: type: String
    descripcion: String,
    cantidades: Number,
    nombreproducto: String
});

const InventarioModel = mongoose.model('Inventario' ,inventarioSchema, 'inventario');
module.exports = InventarioModel;