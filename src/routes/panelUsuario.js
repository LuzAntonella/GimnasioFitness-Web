const express = require('express');
const router = express.Router();
const FormMedico = require('../models/FormMedico')
const User = require('../models/User');
const Docente = require('../models/Docente');
const MatriculaCur = require('../models/MatriculaCurso');
const Curso = require('../models/Curso');
const passport = require('passport');
const cloudinary = require('cloudinary');
const { isAuthenticated } = require('../helpers/auth');
const stripe = require('stripe')('sk_test_51HqNgOCjkOObvbRNDujANQ4wxThStdTye9zCZGYRwzqn1lOfCybR2IoVQaArALPHcIb28CAGJBiAHboiXYl6b4Pp00mIO4UduN');

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

//-----Actualizar Ficha Fisica
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
  console.log(datosF);
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


//guardar el curso que elijo
router.post('/addElegirCurso/:id', isAuthenticated,async (req,res) => {
    console.log(req.params.id)
    const datosF = await Curso.findById(req.params.id);
    //console.log(datosF.nameCurso);
    const newMatriculaCurso = new MatriculaCur({codigoCurso:datosF.codigoCurso,
                                                nameCurso:datosF.nameCurso,
                                                docenteCurso: datosF.docenteCurso,
                                                costoCurso: datosF.costoCurso,
                                                horaInicio: datosF.horaInicio,
                                                horaFin: datosF.horaFin,
                                                descripcionCurso: datosF.descripcionCurso});
    newMatriculaCurso.user = req.user.id;
    await newMatriculaCurso.save();
    req.flash('success_msg','Se ha matriculado en el curso ',datosF.nameCurso);
    res.redirect(('/misPagos'));
});

//Aui sale el boton de pago
router.get('/misPagos', isAuthenticated,async (req, res) => {
  await MatriculaCur.find({user: req.user.id})
      .then(documentos => {
        const contexto = {
            formM: documentos.map(documento => {
            return {
              codigoCurso: documento.codigoCurso,
              nameCurso: documento.nameCurso,
              docenteCurso: documento.docenteCurso,
              costoCurso: documento.costoCurso,
              horaInicio: documento.horaInicio,
              horaFin: documento.horaFin,
              descripcionCurso: documento.descripcionCurso,
              realizoPago: documento.realizoPago,
              id: documento._id
            }
          })
        }
        res.render('panelUsuario/misPagos', {
        matriculaCur: contexto.formM }) 
      })
});

//CARRITO COMPRAS
router.get('/carritoCompras',isAuthenticated,(req, res) => {
  res.render('compras/carrito');
});


//Cursos ya pagados


//DESPUES QUE SE PAGAR -Metodo de pago
router.post('/checkout', async (req,res) => {
  console.log(req.body);
  //Buscar en base de datos
  
  const customer = await stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  });
  const charge = await stripe.charges.create({
    amount: '3000',
    currency: 'usd',
    customer: customer.id,
    description: 'Video Editing Software'
  });
  console.log(charge.id);

  //Respuesta Final
  res.render('panelUsuario/cursosRegistrados');
});

module.exports = router;