const db = require('../db/connection');

module.exports = {

  registrar(cliente, direccion, forma_pago, estado_cobro, usuario_id, items, callback) {
  const fecha = new Date().toISOString();
  const total = items.reduce((acc, item) => acc + parseFloat(item.monto), 0);

  db.run(`INSERT INTO facturas (cliente, direccion, forma_pago, estado_cobro, total, fecha, usuario_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [cliente, direccion, forma_pago, estado_cobro, total, fecha, usuario_id],
    function(err) {
      if (err) return callback(err);
      const factura_id = this.lastID;

      console.log('Antes de pasar a into facturas_items');
      console.log(items);

      const stmt = db.prepare(`INSERT INTO factura_items (factura_id, descripcion, monto) VALUES (?, ?, ?)`);
      for (const item of items) {
        stmt.run(factura_id, item.descripcion, item.monto);
      }
      stmt.finalize();
      callback(null);
    });
},

 verFacturasItems(usuarioId, callback) {
  const sql = `
    SELECT 
      facturas.id AS factura_id,
      facturas.usuario_id,
      facturas.cliente,
      facturas.direccion,
      facturas.fecha,
      facturas.estado_cobro,
      facturas.forma_pago,
      facturas.total,
      factura_items.descripcion,
      factura_items.monto
    FROM 
      facturas
    LEFT JOIN 
      factura_items ON facturas.id = factura_items.factura_id
    WHERE 
      facturas.usuario_id = ?
    ORDER BY 
      facturas.id DESC
  `;

  db.all(sql, [usuarioId], (err, rows) => {
    if (err) return callback(err);

    // Agrupar facturas
    const facturasMap = {};

    rows.forEach(row => {
      const id = row.factura_id;
      if (!facturasMap[id]) {
        facturasMap[id] = {
          id: row.factura_id,
          usuario_id: row.usuario_id,
          cliente: row.cliente,
          direccion: row.direccion,
          fecha: row.fecha,
          estado_cobro: row.estado_cobro,
          forma_pago: row.forma_pago,
          total: row.total,
          items: []
        };
      }

      if (row.descripcion && row.monto != null) {
        facturasMap[id].items.push({
          descripcion: row.descripcion,
          monto: row.monto
        });
      }
    });

    const facturas = Object.values(facturasMap);
    callback(null, facturas);
  });
},


actualizar(id, estado_cobro, forma_pago, callback) {
    const sql = 'UPDATE facturas SET estado_cobro = ?, forma_pago = ? WHERE id = ?';
    db.run(sql, [estado_cobro, forma_pago, id], callback);
  },


  
};
