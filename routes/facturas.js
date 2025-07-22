const express = require('express');
const router = express.Router();
const Factura = require('../models/facturaModel');

// Middleware para proteger rutas
function auth(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  next();
}

// Mostrar formulario de ingreso de factura
router.get('/', auth, (req, res) => {
  const usuarioId = req.session.user?.id || 0;

  Factura.verFacturasItems(usuarioId, (err, facturas) => {
  if (err) return res.send('Error al obtener facturas');

  res.render('facturas', { facturas });
  });
});

router.post('/registrar2', auth, (req, res) => {
  const { cliente, direccion, forma_pago, estado_cobro } = req.body;
  const usuario = req.session.user?.id || 'Desconocido';

  const descripciones = req.body["descripcion"];
  const montos = req.body["monto"];

  const descripcionesArray = Array.isArray(descripciones) ? descripciones : [descripciones];
  const montosArray = Array.isArray(montos) ? montos : [montos];

  const items = descripcionesArray.map((desc, i) => ({
    descripcion: desc,
    monto: parseFloat(montosArray[i])
  }));

  Factura.registrar(cliente, direccion, forma_pago, estado_cobro, usuario, items, (err) => {
    if (err) {
      console.error('Error al registrar factura:', err);
      return res.send("Error al registrar la factura: " + err.message);
    }
      res.redirect('/facturas');
    });
  });

router.post('/editar/:id', auth, (req, res) => {
  const { id } = req.params;
  const { estado_cobro, forma_pago } = req.body;

  //console.log(req.body);

  Factura.actualizar(id, estado_cobro, forma_pago, (err) => {
    if (err) return res.send('Error al actualizar');

    res.redirect("/facturas");
    });
  });

module.exports = router;
