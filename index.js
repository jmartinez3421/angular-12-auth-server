const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
const path = require('path');
require('dotenv').config();


//Crear el servidor/aplicacion de express
const app = express();

//Conexion a la DB
dbConnection();

//Directorio Publico
app.use( express.static('./public') );

//CORS
app.use( cors() );

//Leer y parsear la informacion del Body
app.use( express.json() );

//Rutas
app.use( '/api/auth', require('./routes/auth') );


//Manejar las demás rutas
app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
})


//Levantar app, entre paréntesis indicamos el puerto en el que lo levantamos y una función que se ejecutará
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});