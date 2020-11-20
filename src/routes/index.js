const express = require('express');
const router = express.Router();
const Docente = require('../models/Docente');
router.get('/',async (req, res) => {
    await Docente.find({Docente: req.body._id})
    .then(documentos => {
        const contexto = {
            Docente: documentos.map(documento => {
            return {
                dni: documento.dni,
                name: documento.name,
                apellido: documento.apellido,
                telefono: documento.telefono,
                email: documento.email,
                profesion: documento.profesion,
                image: documento.imageURL,
                id: documento._id,
                
            }
          })
        }
        res.render('index', {Docente: contexto.Docente}); 
      });
});

router.get('/about',(req, res) => {
    res.render('about');
});

module.exports = router;