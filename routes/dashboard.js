const express = require('express');
const router = express.Router();
const db = require('../db/connection');


function auth(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  next();
}

router.get('/', auth, (req, res) => {

  console.log("Entró a /dashboard");

    const usuario = req.session.user?.nombre || 'Desconocido';

    console.log(usuario);

    res.render('dashboard', { user: req.session.user })
  });

module.exports = router;

