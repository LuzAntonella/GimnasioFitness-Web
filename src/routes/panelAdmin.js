const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Docente = require('../models/Docente');
const Curso = require('../models/Curso');
const passport = require('passport');
const cloudinary = require('cloudinary');
const { isAuthenticated } = require('../helpers/auth');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');

router.get('/moduloU', isAuthenticated, async (req, res) => {
    User.count({}, function(err, count) {
        console.log( "Total: ", count);
    });
   
    await Curso.find({curso: req.body._id})
    
      .then(documentos => {
        const contexto = {
            Curso: documentos.map(documento => {
            return {
                nameCurso: documento.nameCurso,
                costoCurso: documento.costoCurso,
                id: documento._id,
                
            }
          })
        }
        res.render('panelAdmin/tableroAdmin', {Curso: contexto.Curso}); 
      });
});
router.get('/usuariosAdmin', isAuthenticated, async (req, res) => {
    await User.find({user: req.body._id})
    
      .then(documentos => {
        const contexto = {
            User: documentos.map(documento => {
            return {
                dni: documento.dni,
                name: documento.name,
                apellido: documento.apellido,
                telefono: documento.telefono,
                email: documento.email,
                image: documento.imageURL,
                role: documento.role,
                id: documento._id,
                
            }
          })
        }
        res.render('panelAdmin/usuariosAdmin', {User: contexto.User}); 
      });
});

router.get('/docentesAdmin',isAuthenticated,async (req, res) => {
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
        res.render('panelAdmin/docentesAdmin', {Docente: contexto.Docente}); 
      });
});

//recibir datos de registro DOCENTE
router.post('/docentesAdmin', async (req, res) =>{
    const {dni,name,apellido,genero,telefono,email,profesion,fechaNacimiento} = req.body;
    const errors = [];
    console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);
    if(!name){
        errors.push({text: 'Por favor inserte su nombre'});
    }
    if(!apellido){
        errors.push({text: 'Por favor inserte su apellido'});
    }
    if(!telefono){
        errors.push({text: 'Por favor inserte su teléfono'});
    }
    if (errors.length > 0){
        res.render('panelAdmin/docentesAdmin', {errors,dni,name,apellido,genero,telefono,email,profesion,fechaNacimiento});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg','The Email is already in use');
            res.redirect('/docentesAdmin');
        }

        const newDocente = new Docente({
            dni,
            name,
            apellido,
            genero,
            telefono,
            email,
            profesion,
            fechaNacimiento,
            imageURL : result.url,
            public_id : result.public_id
        });
        await newDocente.save();
        await fs.unlink(req.file.path);
        req.flash('success_msg','You are registered');
        res.redirect('/docentesAdmin');
    }
   
});

//mostrar docente a la hora de agregar nuevo
router.get('/nuevoCursoAdmin',isAuthenticated,(req, res) => {
 
      Docente.find({Docente: req.body.docenteCurso})
    
      .then(documentos => {
        const contexto = {
            Docente: documentos.map(documento => {
            return {
                name: documento.name,
                apellido: documento.apellido,
                image: documento.imageURL,
                id: documento._id,
            }
          })
        }
        res.render('panelAdmin/new-curso', {Docente: contexto.Docente}); 
      });
    
});

router.get('/cursosAdmin',isAuthenticated,(req, res) => {
    Curso.find({Curso: req.body.codigoCurso})
    .then(documentos => {
    const contexto = {
        Curso: documentos.map(documento => {
        return {
            codigoCurso: documento.codigoCurso,
            nameCurso: documento.nameCurso,
            docenteCurso: documento.docenteCurso,
            costoCurso: documento.costoCurso,
            horaInicio: documento.horaInicio,
            horaFin: documento.horaFin,
            descripcionCurso: documento.descripcionCurso,
            id: documento._id,
        }
        })
    }
    res.render('panelAdmin/cursosAdmin', {Curso: contexto.Curso}); 
    });
});
//recibir datos de registro Cursos
router.post('/cursosAdmin', async (req, res) =>{
    const {codigoCurso,nameCurso,docenteCurso,costoCurso,horaInicio,horaFin,descripcionCurso} = req.body;
    const errors = [];
    
    if(!codigoCurso){
        errors.push({text: 'Por favor inserte el codigo del curso'});
    }
    if(!nameCurso){
        errors.push({text: 'Por favor inserte su nombre del curso'});
    }
    if(!docenteCurso){
        errors.push({text: 'Por favor elija un docente para el curso'});
    }
    if (errors.length > 0){
        res.render('panelAdmin/cursosAdmin', {errors,codigoCurso,nameCurso,docenteCurso,costoCurso,horaInicio,horaFin,descripcionCurso});
    }else{
        const newCurso = new Curso({
            codigoCurso,
            nameCurso,
            docenteCurso,
            costoCurso,
            horaInicio,
            horaFin,
            descripcionCurso,
        });
        await newCurso.save();
        req.flash('success_msg','You are registered');
        res.redirect('/cursosAdmin');
    }
   
});

//mostrar perfil
router.get('/perfilU', isAuthenticated, async (req, res) => {
    res.render('panelAdmin/perfilA'); 
});

//eliminar un curso
router.delete('/curso/delete/:id',isAuthenticated, async (req,res) => {
    await Curso.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Persona Deleted Successfully');
    res.redirect('/cursosAdmin');
});

//eliminar un docente
router.delete('/docente/delete/:id',isAuthenticated, async (req,res) => {
    await Docente.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Persona Deleted Successfully');
    res.redirect('/docentesAdmin');
});

//eliminar un usuario
router.delete('/usuario/delete/:id',isAuthenticated, async (req,res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Persona Deleted Successfully');
    res.redirect('/usuariosAdmin');
});


//------------------ACTUALIZAR
//ACTUALIZAR DOCENTES
router.get('/docente/edit/:id',isAuthenticated, async (req, res) => {

    const datosF = await Docente.findById(req.params.id)
    .then(data =>{
        return {
            dni:data.dni,
            name:data.name,
            apellido: data.apellido,
            genero: data.genero,
            telefono: data.telefono,
            email: data.email,
            profesion: data.profesion,
            fechaNacimiento: data.fechaNacimiento,
            imageURL: data.imageURL,
            public_id: data.public_id,
            id:data.id
        }
    })
    res.render('panelAdmin/edit-docentes',{datosF})
   // OBSERVABLES-Eliminamos el elemento en algún momento del programa
    datosF.parentNode.removeChild(datosF);
  });

router.put('/docente/edit-docente/:id', isAuthenticated,async (req, res) =>{
    const {dni,name,apellido,genero,telefono,email,profesion,fechaNacimiento,imageURL,public_id} = req.body;
    const errors = [];
    if(!name){
        errors.push({text: 'Por favor inserte su nombre'});
    }
    if(!apellido){
        errors.push({text: 'Por favor inserte su apellido'});
    }
    if(!telefono){
        errors.push({text: 'Por favor inserte su teléfono'});
    }
    if (errors.length > 0){
        res.render('panelAdmin/docentesAdmin', {errors,dni,name,apellido,genero,telefono,email,profesion,fechaNacimiento,imageURL,public_id});
    }else{
       
      //actualizar
     await Docente.findByIdAndUpdate(req.params.id,{dni,name,apellido,genero,telefono,email,profesion,fechaNacimiento,imageURL,public_id});
     req.flash('success_msg','Docente Updated Successfully');
     res.redirect(('/docentesAdmin'));
    }
    
});
module.exports = router;