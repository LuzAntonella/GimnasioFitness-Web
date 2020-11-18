const mongoose = require('mongoose');
const { Schema } = mongoose;


const CursoSchema = new Schema({
    codigoCurso:{ type:String, required:true},
    nameCurso: { type:String, required:true},
    docenteCurso: { type:String, required:true},
    costoCurso: { type:Number, required:true},
    horaInicio: { type:String, required:true},
    horaFin: { type:String, required:true},
    descripcionCurso: { type:String, required:true},
    date: { type:Date, default: Date.now }
    
});

module.exports = mongoose.model('Curso', CursoSchema);
