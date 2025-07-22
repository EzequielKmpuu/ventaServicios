// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'tu_clave_secreta',
  resave: false,
  saveUninitialized: true

}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/facturas', require('./routes/facturas'));


// Iniciar servidor con el movil
//app.listen(3000, '192.168.1.160', () => {
//    console.log('Servidor corriendo en http://localhost:3000 para poder entrar con el movil');
//  });

// Iniciar servidor
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} LOCAL`);
  });
