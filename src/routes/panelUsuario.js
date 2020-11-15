const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Docente = require('../models/Docente');
const Curso = require('../models/Curso');
const passport = require('passport');
const cloudinary = require('cloudinary');
const { isAuthenticated } = require('../helpers/auth');

/*router.get('/users/signup/:id',isAuthenticated, async (req, res) => {
  const user= await User.findById(req.params.id)
  .then(data =>{
      return {
          name: data.name
      }
  })
  res.render('panelUsuario/elegirCurso',{user});
});*/
router.get('/cursosUsuario', isAuthenticated,(req, res) => {
        res.render('panelUsuario/elegirCurso');
});

module.exports = router;