const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
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

router.post('/send-email',async(req,res) => {
    const {name , email , phone ,message} = req.body;
    contentHTML = `
        <h1>User Information</h1>
        <ul>
            <li>Username: ${name}</li>
            <li>User Email: ${email}</li>
            <li>PhoneNumber: ${phone}</li>
        </ul>
        <p>${message}</p>
    `;
   console.log(contentHTML);
   
    req.flash('success_msg','Correo Enviado Correctamente');
    res.redirect('/about');
});

module.exports = router;