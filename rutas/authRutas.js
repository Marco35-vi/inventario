const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro 
rutas.post('/registro', async (req, res) => {
    try {
        const { nombreusuario, correo, contrasenia } = req.body;
        const usuario = new Usuario({ nombreusuario, correo, contrasenia });
        await usuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Inicio de sesion
rutas.post('/iniciarsesion', async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            console.log('Correo inválido');
            return res.status(401).json({ error: 'Correo inválido' });
        }

        const validarContrasena = await usuario.compararContrasenia(contrasenia);
        if (!validarContrasena) {
            console.log('Contraseña inválida');
            return res.status(401).json({ error: 'Contraseña inválida' });
        }

        // Creación de token
        const token = jwt.sign({ usuarioId: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        usuario.token = token;
        await usuario.save();

        res.json({ token });
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ mensaje: error.message });
    }
});

// Cerrar sesion
rutas.post('/cerrarsesion', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ mensaje: 'No existe el token de autenticación' });
        }

        let decodificar;
        try {
            decodificar = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ mensaje: 'El token ha expirado' });
            }
            return res.status(401).json({ mensaje: 'Token inválido' });
        }

        const usuario = await Usuario.findById(decodificar.usuarioId);

        if (!usuario || usuario.token !== token) {
            return res.status(401).json({ mensaje: 'Usuario no autorizado' });
        }

        usuario.token = null;
        await usuario.save();

        res.json({ mensaje: 'Sesión cerrada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cerrar sesión' });
    }
});

module.exports = rutas;

