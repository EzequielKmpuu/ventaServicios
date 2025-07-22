const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'base.sqlite'), (err) => {
  if (err) console.error('Error al conectar a la BD', err);
});


module.exports = db;
