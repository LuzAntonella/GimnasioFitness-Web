const express = require('express');
const router = express.Router();
const FormMedico = require('../models/FormMedico')
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
});
router.get('/panelUsu', isAuthenticated,(req, res) => {
        res.render('panelUsuario/elegirCurso');
});*/

router.get('/panelUsu', isAuthenticated,async (req, res) => {
  await Curso.find({curso: req.body._id})
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
      res.render('panelUsuario/elegirCurso', {Curso: contexto.Curso}); 
    });
});

router.get('/misCursos', isAuthenticated,(req, res) => {
  res.render('panelUsuario/misCursos');
});
router.get('/misDatosFisicos', isAuthenticated,async (req, res) => {
  await FormMedico.find({user: req.user.id})
      .then(documentos => {
        const contexto = {
            formM: documentos.map(documento => {
            return {
              deporteF:documento.deporteF,
              alimentacionF : documento.alimentacionF,
              horasSueñoF : documento.horasSueñoF,
              fechaExaF : documento.fechaExaF,
              pesoF: documento.pesoF,
              tallaF: documento.tallaF,
              grasaCorporalF: documento.grasaCorporalF,
              masaMagraF: documento.masaMagraF,
              id: documento._id
            }
          })
        }
        res.render('panelUsuario/datosFisicos', {
        formM: contexto.formM }) 
      })
});

//-------------------------

//-------
router.get('/miPerfil', isAuthenticated,(req, res) => {
  res.render('panelUsuario/perfilG');
});

router.get('/addDatosFis',isAuthenticated,(req, res) => {
  res.render('panelUsuario/addDatosF');
});

//aqui guardo los datos en la BD(esto es de formulario medico)
router.post('/addFicha', isAuthenticated,async (req,res) => {
  const {deporteF,alimentacionF,horasSueñoF,fechaExaF,pesoF,tallaF,grasaCorporalF,masaMagraF}= req.body;
  const errors =[];
  if(!deporteF){
      errors.push({text:'Por favor inserte deporte'});
  }
  if(!alimentacionF){
      errors.push({text:'Por favor inserte tipo de alimentacion'});
  }
  if(!horasSueñoF){
      errors.push({text:'Por favor inserte cantidad de horas que duerme'});
  }
  //falta validar los demas datos
  if(errors.length > 0){
      res.render('panelUsuario/addDatosF',{
          errors,
          deporteF,
          alimentacionF,
          horasSueñoF,
          fechaExaF,
          pesoF,
          tallaF,
          grasaCorporalF,
          masaMagraF
      });
  } else{
      const newFormMedico = new FormMedico({deporteF,alimentacionF,horasSueñoF,fechaExaF,pesoF,tallaF,grasaCorporalF,masaMagraF});
      //enlazo para cada uno
      newFormMedico.user = req.user.id;
      await newFormMedico.save();
      req.flash('success_msg','Ficha física agregada exitosamente');
      //luego de que se guarda lo direcciono a selección cita
      res.redirect('/misDatosFisicos');

  }
});

//-----Actualizar Ficha Medica
router.get('/fichaM/edit/:id',isAuthenticated, async (req, res) => {

  const datosF = await FormMedico.findById(req.params.id)
  .then(data =>{
      return {
        deporteF:data.deporteF,
        alimentacionF : data.alimentacionF,
        horasSueñoF : data.horasSueñoF,
        fechaExaF : data.fechaExaF,
        pesoF: data.pesoF,
        tallaF: data.tallaF,
        grasaCorporalF: data.grasaCorporalF,
        masaMagraF: data.masaMagraF,
        id:data.id
      }
  })
  res.render('panelUsuario/edit-datosF',{datosF})
});

router.put('/fichaM/edit-fichaM/:id', isAuthenticated,async (req, res) =>{
  const {deporteF,alimentacionF,horasSueñoF,fechaExaF,pesoF,tallaF,grasaCorporalF,masaMagraF}= req.body;
  const errors =[];
  if(!deporteF){
      errors.push({text:'Por favor inserte deporte'});
  }
  if(!alimentacionF){
      errors.push({text:'Por favor inserte tipo de alimentacion'});
  }
  if(!horasSueñoF){
      errors.push({text:'Por favor inserte cantidad de horas que duerme'});
  }
  //falta validar los demas datos
  if(errors.length > 0){
      res.render('panelUsuario/edit-DatosF',{
          errors,
          deporteF,
          alimentacionF,
          horasSueñoF,
          fechaExaF,
          pesoF,
          tallaF,
          grasaCorporalF,
          masaMagraF
      });
    }else{
      //actualizar
    await FormMedico.findByIdAndUpdate(req.params.id,{deporteF,alimentacionF,horasSueñoF,fechaExaF,pesoF,tallaF,grasaCorporalF,masaMagraF});
    req.flash('success_msg','Ficha Física Updated Successfully');
    res.redirect(('/misDatosFisicos'));
    }
  
});
module.exports = router;