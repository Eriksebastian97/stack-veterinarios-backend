import nodemailer from "nodemailer";

const emailOlivdePassword = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;

  //enviar el email

  const info = await transporter.sendMail({
    from: "APV -Administracion de Pacientes de Veterinaria", //quien envia el email
    to: email, //aquien se le envia el email
    subject: "Reestable tu Paswword", //asunto
    text: "Restablece tu Password",
    html: `<p>Hola: ${nombre}, Has solicitado reestablecer tu password</p>

    <p>Sigue el siguiente enlace para generar un nuevo Password:
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a> </p>

    <p> Si tu no creaste esta cuenta , puedes ignorar el mensaje</p>


    `,
  });

  console.log("mensaje enviado: %s", info.messageId);
};

export default emailOlivdePassword;
