const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/base.sqlite');

db.run(`INSERT INTO usuarios (nombre, email, password, rol, activa) VALUES ( ?, ?, ?, ?, ?)`, 
  ['Ezequiel', 'admin@mail.com', 'prueba2', 'Admin', 1], 
  (err) => {
    if (err) return console.log('Error:', err.message);
    console.log('Usuario creado con éxito');
    db.close();
});




//const movimientos1 = await db.all('SELECT * FROM movimientos');
//console.log(movimientos1);
