import express from "express"
import dotenv from "dotenv" ////exprees necesita una dependencia para leer esas variable de entorno y donde se encuentran  , necesitamos instalar npm i dotenv 
import cors from "cors"
import conectarDB from "./config/db.js" //conexion a base de datos
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"

 const app = express()
app.use(express.json()) // le estamos enviando datos de tipo Json

dotenv.config()
conectarDB()

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin:function(origin,callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //el origen del request esta permitido
            callback(null,true)
        }else{
            callback(new Error("no permitdo por cors..."))
        }
    }
}

app.use(cors(corsOptions))

 // una ves que hagamos el deployment  , este puerto se asigna automaticamente
 // req es lo que mandas al servidor y res es la respuesta del servidor 
app.use("/api/veterinarios", veterinarioRoutes ) //cuando visitemos /api/veterinarios/ va a llamar a veterinarioRoutes osea a las distintas rutas que realizemos en el archivo
app.use("/api/pacientes", pacienteRoutes)

const PORT = process.env.PORT || 4000 


app.listen(PORT,()=>{
    console.log(`servidor funcionando en el perto ${PORT}`)
})