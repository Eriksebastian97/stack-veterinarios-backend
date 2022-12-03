import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") // comprobamos que le estamos enviando un toke y que tenga el Bearer
  ) { 
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_secret); //decoded tenemos acceso a los datos del jwt ,

      req.veterinario = await Veterinario.findById(decoded.id).select(
        "-password"
      );

      return next();
    } catch (error) {
      const e = new Error("token no valido o inexistente");
      return res.status(403).json({ msg: e.message });
    }
  }

  if (!token) {
    const error = new Error("token no valido o inexistente");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
