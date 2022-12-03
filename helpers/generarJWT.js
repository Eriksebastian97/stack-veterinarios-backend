import jwt from "jsonwebtoken"

const generarJWT = (id)=>{
return jwt.sign({id}, process.env.JWT_SECRET,{ //sign genera un nuevo web token
    expiresIn: "30d"
})
}

export default generarJWT