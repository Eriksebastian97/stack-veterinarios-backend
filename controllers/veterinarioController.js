import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js"; // genera los json web tokens y comprueba si son correctos
import generarId from "../helpers/generarId.js";
import e from "express";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlivdePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { email , nombre} = req.body;

  //prevenir usuarios duplicados
  const existeUsuario = await Veterinario.findOne({ email }); //findOne te perimite buscar por las diferentes atributos que tenga cada base de datos

  if (existeUsuario) {
    const error = new Error("usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    //guardar un nuevo veterinario
    const veterinario = new Veterinario(req.body); //creamos una nueva instancia de veterinarios con los modelos con la informacion que le estamos pasando req.body
    const veterinarioGuardado = await veterinario.save(); //save es util si tienes un objeto si lo vas a guardar en una base de datos o si tienes un objeto lo puedes modificar y luego guardar
    
    //enviar el email
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token
    })

    res.json(veterinarioGuardado); 
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;

  res.json(veterinario);
};

const confirmar = async (req, res) => {
  const { token } = req.params; //cuando leemos datos de la url utilizamos params cuando es dinamico

  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) { // si no existe el usuario a confirmar
    const error = new Error("token no valido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();

    res.json({ msg: "usuario confirmado correctamente..." });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");

    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //revisar el password

  if (await usuario.comprobarPassword(password)) {
    //Autenticar
   
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token:generarJWT(usuario.id)
    });
  } else {
    const error = new Error("el password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const existeVeterinario = await Veterinario.findOne({ email });

  if (!existeVeterinario) {
    const error = new Error(" El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }
  try {
    existeVeterinario.token = generarId();
    await existeVeterinario.save();
   //enviar Email con instrucciones
    emailOlivdePassword({
      email,
      nombre:existeVeterinario.nombre,
      token: existeVeterinario.token
    })

    res.json({ msg: "hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};
const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Veterinario.findOne({ token });

  if (tokenValido) {
    //el token es valido el usuario existe
    res.json({ msg: "token valido y el usuario existe" });
  } else {
    const error = new Error("token no valido");
    return res.status(400).json({ msg: error.message });
  }
};
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });
  if (!veterinario) {
    const error = new Error("hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.json({ msg: "password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
};
