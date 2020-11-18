const mongoose = require('mongoose');
const { Schema } = mongoose;
const FormMedicoSchema = new Schema({
    deporteF: { type:String, required:true},
    alimentacionF: { type:String, required:true },
    horasSueñoF : { type:Number, required:true },
    fechaExaF : { type:String, required:true },
    pesoF : { type:Number, required:true },
    tallaF : { type:Number, required:true },
    grasaCorporalF : { type:Number, required: true },
    masaMagraF : { type:Number, required:true},
    date : { type:Date, default: Date.now },
    user : { type: String}
});
//agrego el user para relacionarlo-y se modifica en la cita-Post
module.exports = mongoose.model('FormMedico', FormMedicoSchema);