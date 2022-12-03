import mongoose from "mongoose";
import brycpt from "bcrypt" //hallear los password con npm i brcypr mayor seguridad y comprobar los datos
import generarId from "../helpers/generarId.js";

//con unique en el modelo nos garantizamos un perfil por cuenta
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    telefono:{
        type: String,
        default:null,
        trim:true
    },
    web:{
        type:String,
        default:null
    },
    token:{
     type:String,
     default: generarId(),

    },
    confirmado:{
        type:Boolean,
        default:false
    }
})

veterinarioSchema.pre("save", async function(next){ //pre y save antes de almacenarlos en base de datos
    if(!this.isModified("password")){ //si un password ya esta hallao no vuelva a hallear
        next() //next es ir al siguiente middleware
    }
    const salt = await brycpt.genSalt(10) //gentSalt generar 12 rondas de hallear
    this.password = await brycpt.hash(this.password, salt) //modificamos antes que se almacene y antes de llegar a la ultima linea va estar halleado
})

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await brycpt.compare(passwordFormulario , this.password ) //compare nos va si permitir si escibimos en postman un password los va a comparar con el password de la base de datos
}


const Veterinario = mongoose.model("Veterinario",veterinarioSchema) //lo registramos en moogose con model y queda registrado como un modelo , como algo que tiene que interactuar con la base de datos
export default Veterinario

