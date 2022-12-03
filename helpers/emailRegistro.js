import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
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
    subject: "comprueba tu cuenta en APV", //asunto
    text: "Comprueba tu cuenta en APV",
    html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV</p>
    <p>Tu cuenta ya esta lista , solo debes comprobarla en el siguiente enlace:
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>

    <p> Si tu no creaste esta cuenta , puedes ignorar el mensaje</p>


    `,
  });

  console.log("mensaje enviado: %s", info.messageId);
};

export default emailRegistro;
