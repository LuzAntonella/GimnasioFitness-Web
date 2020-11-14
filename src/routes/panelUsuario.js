const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Docente = require('../models/Docente');
const Curso = require('../models/Curso');
const passport = require('passport');
const cloudinary = require('cloudinary');
const { isAuthenticated } = require('../helpers/auth');

router.get('/cursosUsuario', isAuthenticated,(req, res) => {

    res.render('panelUsuario/elegirCurso');
});

module.exports = router;