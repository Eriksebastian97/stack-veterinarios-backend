import mongoose from "mongoose"; // 

const conectarDB = async ()=>{
 
   try{
      const db = await mongoose.connect(process.env.MONGO_URI,{ //con mongoose.connect nos permite conectarnos a una base de datos , creamos el env la variable de entorno para mayor seguridad y la leemos con process.env es sintaxis de node.js es la forma de procesar esas variables de entorno y leerlas
        useNewUrlParser:true,
        useUnifiedTopology: true
      }) //exprees necesita una dependencia para leer esas variable de entorno y donde se encuentran  , necesitamos instalar npm i dotenv 

   const url = `${db.connection.host}:${db.connection.port}` //el db.connection hots nos da una url y el db.port nos da el puerto donde se esta conectando
   console.log(`MongoDB conectado en: ${url}`)

   }catch (error){
    console.log(`error: ${error.message}`)
    process.exit(1)
   }
}

export default conectarDB