const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    nombreusuario: {
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contrasenia: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
});

// Hashear contrasenia antes de guardar
usuarioSchema.pre('save', async function (next) {
    if (this.isModified('contrasenia')) {
        this.contrasenia = await bcrypt.hash(this.contrasenia, 10);
    }
    next();
});

// Comparar contrasenias
usuarioSchema.methods.compararContrasenia = async function (contraseniaComparar) {
    return await bcrypt.compare(contraseniaComparar, this.contrasenia);
};

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuario');
module.exports = Usuario;
