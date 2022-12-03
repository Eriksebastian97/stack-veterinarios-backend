import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema({
   nombre:{
    type:String,
    required:true,
   },
   propietario:{
    type:String,
    required:true,
   },
   email:{
    type:String,
    required:true,
   },
   fecha:{
    type: Date,
    required:true,
    default:Date.now(),
   },
   sintomas:{
    type:String,
    required:true,
   },
   veterinario:{
    type: mongoose.Schema.Types.ObjectId, //almacenamos el id del modelo del veterinario
    ref:"Veterinario" // con ref traemos la informacion de veterinario
   },

},{
    timestamps:true, //nos crea las columna de creado y editado
})

const Paciente = mongoose.model("Paciente",pacientesSchema)

export default Paciente
