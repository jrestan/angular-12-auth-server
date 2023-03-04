const express = require('express');
const cors = require('cors');
const { dbConnecion } = require('./db/config');
require('dotenv').config();



console.log( process.env );

//crear el servidor de aplicaciones en express
const app = express();

//Base de datos
dbConnecion();

//Directorio publico
app.use( express.static('public') );

//CORS
app.use( cors() );

//Lectura y parseo del body
app.use( express.json() );

/*
//GET
app.get('/',(req, res)=>{
    console.log('Peticion en el /');


    //res.json({ ...<==podria ser asi nomas

    res.status(200).json({
        ok: true,
        msg: 'Todo funcionó correctamente',
        uid: 123456789
    });

});
*/

//Rutas
app.use( '/api/auth', require('./routes/auth') );


app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

//console.log('Hola desde node!!! ...Javier Restan');