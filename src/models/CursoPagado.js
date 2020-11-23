const mongoose = require('mongoose');
const { Schema } = mongoose;
const CursoPagadoSchema = new Schema({
    codigoCurso:{ type:String, required:true},
    nameCurso: { type:String, required:true},
    docenteCurso: { type:String, required:true},
    costoCurso: { type:Number, required:true},
    horaInicio: { type:String, required:true},
    horaFin: { type:String, required:true},
    descripcionCurso: { type:String, required:true},
    estado : { type:String, default: 'activo' },
    date : { type:Date, default: Date.now },
    user : { type: String}
});
//agrego el user para relacionarlo-y se modifica en la cita-Post
module.exports = mongoose.model('CursoPagado', CursoPagadoSchema);