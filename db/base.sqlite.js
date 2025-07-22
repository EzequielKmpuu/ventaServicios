
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'base.sqlite'); // Usá tu nombre real de base
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    email TEXT,
    password TEXT,
    rol TEXT,
    activa BOOLEAN DEFAULT 1
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    cliente TEXT,
    direccion TEXT,
    fecha TEXT,
    estado_cobro TEXT,
    forma_pago TEXT,
    total INTEGER,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS factura_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    factura_id INTEGER,
    descripcion TEXT,
    monto REAL,
    FOREIGN KEY(factura_id) REFERENCES facturas(id)
  )`);
});

module.exports = db;
