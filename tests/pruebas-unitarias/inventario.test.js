const express = require('express');
const request = require('supertest');
const inventarioRutas = require('../../rutas/inventarioRutas');
const InventarioModel = require('../../models/Inventario');
const mongoose  = require('mongoose');
const app = express();
app.use(express.json());
app.use('/inventarios', inventarioRutas);

describe('Pruebas Unitarias para Inventarios', () => {
    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/appinventario',{
            useNewUrlParser : true,            
        });
        await InventarioModel.deleteMany({});
    });
    // al finalziar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
      });

    //1er test : GET
    test('Deberia Traer todas las recetas metodo: GET: traerInventario', async() =>{
        await InventarioModel.create({ nombreproducto: 'Mouse', descripcion: 'Rojo, Inalambrico, Genius', cantidades: 15, precio: 40 });
        await InventarioModel.create({ nombreproducto: 'Teclado', descripcion: 'Gamer, Teclas mecanicas, Rowell', cantidades: 10, precio: 200 });
        // solicitud - request
        const res =  await request(app).get('/inventarios/traerInventario');
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);

});