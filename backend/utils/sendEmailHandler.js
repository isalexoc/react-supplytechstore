import nodemailer from "nodemailer";

const emailAdminUser = process.env.ADMIN_EMAIL;
const passCodeGoogle = process.env.PASS_CODE_GOOGLE;

const defaultEmailTemplate = (data) => {
  return `
    <html>
      <head>
        <style>
          .email-body { font-family: Arial, sans-serif; }
          .email-header { background-color: #f3f3f3; padding: 10px; text-align: center; }
          .email-content { margin: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #d5d6d9; color: #000; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="email-body">
          <div class="email-header">
            <img src="https://res.cloudinary.com/isaacdev/image/upload/v1712762382/logosup_xadbto.png" width="200" style="height: auto;" alt="Logo">
            <h2>${data.subject}</h2>
          </div>
          <div class="email-content">
            <p>${data.message}</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const emailTemplate = (userName, profileUrl) => {
  return `
    <html>
      <head>
        <style>
          .email-body { font-family: Arial, sans-serif; }
          .email-header { background-color: #f3f3f3; padding: 10px; text-align: center; }
          .email-content { margin: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #d5d6d9; color: #000; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="email-body">
        <div class="email-body">
          <div class="email-header">
            <img src="https://res.cloudinary.com/isaacdev/image/upload/v1712762382/logosup_xadbto.png" width="200" style="height: auto;" alt="Logo">
            <h2>Orden de compra</h2>
          </div>
          <div class="email-content">
            <p>Hola ${userName},</p>
            <p>Gracias por tu orden de compra en nuestra tienda. Tu orden ha sido recibida y será procesada en breve.</p>
            <p>Puedes ver el estado de tu orden en tu perfil:</p>
            <a href="${profileUrl}" class="button">Ver Perfil</a>
            <p>También puedes contactarnos si tienes alguna pregunta.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const emailTemplateAdmin = ({
  subject,
  clientUser,
  clientEmail,
  clientOrder,
  clientId,
}) => {
  return `
    <html>
      <head>
        <style>
          .email-body { font-family: Arial, sans-serif; }
          .email-header { background-color: #f3f3f3; padding: 10px; text-align: center; }
          .email-content { margin: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #d5d6d9; color: #000; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="email-body">
          <div class="email-header">
            <img src="https://res.cloudinary.com/isaacdev/image/upload/v1712762382/logosup_xadbto.png" width="200" style="height: auto;" alt="Logo">
            <h2>Orden de compra</h2>
          </div>
          <div class="email-content">
            <p>${subject}</p>
            <p>Cliente: ${clientUser}</p>
            <p>Email: ${clientEmail}</p>
            <p>Orden: ${clientOrder}</p>
            <a href="https://www.supplytechstore.com/order/${clientOrder}" class="button">Ver Orden</a>
            <p>Cliente ID: ${clientId}</p>
            <a href="https://www.supplytechstore.com/admin/orderlist" class="button">Ver todas las Ordenes</a>
            <a href="mailto:${clientEmail}" class="button">Enviar Email</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

const emailTemplateNewSubscriber = ({ subject, userInfo, email }) => {
  const isRegister = userInfo ? "Si" : "No";
  const registerName = userInfo || "No registrado";
  return `
    <html>
      <head>
        <style>
          .email-body { font-family: Arial, sans-serif; }
          .email-header { background-color: #f3f3f3; padding: 10px; text-align: center; }
          .email-content { margin: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #d5d6d9; color: #000; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="email-body">
          <div class="email-header">
            <img src="https://res.cloudinary.com/isaacdev/image/upload/v1712762382/logosup_xadbto.png" width="200" style="height: auto;" alt="Logo">
            <h2>Nuevo subscriptor</h2>
          </div>
          <div class="email-content">
            <p>${subject}</p>
            <p>Registrado: ${isRegister}</p>
            <p>Nombre: ${registerName}</p>
            <p>Email: ${email}</p>
            <a href="mailto:${email}" class="button">Enviar Email</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

const emailTemplatePaymentConfirmation = ({
  admin,
  type,
  name,
  to,
  userEmail,
  code,
  orderId,
  image,
}) => {
  if (admin) {
    return `
      <html>
        <head>
          <style>
            .email-body { font-family: Arial, sans-serif; }
            .email-header { background-color: #f3f3f3; padding: 10px; text-align: center; }
            .email-content { margin: 20px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #d5d6d9; color: #000; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="email-body">
            <div class="email-header">
              <img src="https://res.cloudinary.com/isaacdev/image/upload/v1712762382/logosup_xadbto.png" width="200" style="height: auto;" alt="Logo">
              <h2>Confirmación de pago por: ${type}</h2>
            </div>
            <div class="email-content">
              <p>Usuario: ${name}</p>
              <p>Email: ${userEmail}</p>
              <a href="mailto:${userEmail}" class="button">Enviar Email</a>
              <p>Número de referencia: ${code}</p>
              <p>Orden ID: ${orderId}</p>
              <a href="https://www.supplytechstore.com/order/${orderId}" class="button">Ver Orden</a>
              <p>Imagen de la transferencia:</p>
              <img src="${image}" width="200" style="height: auto;" alt="Imagen de la transferencia">
            </div>
          </div>
        </body>
      </html>
    `;
  } else {
    return `
      <html>
        <head>
          <style>
            .email-body { font-family: Arial, sans-serif; }
            .email-header { background-color: #f3f3f3; padding: 10px; text-align: center; }
            .email-content { margin: 20px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #d5d6d9; color: #000; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="email-body">
            <div class="email-header">
              <img src="https://res.cloudinary.com/isaacdev/image/upload/v1712762382/logosup_xadbto.png" width="200" style="height: auto;" alt="Logo">
              <h2>Confirmación de pago por: ${type}</h2>
            </div>
            <div class="email-content">
            <p>Gracias por enviar la confirmación de pago. Tu comprobante de pago ha sido recibido y será procesado en breve.</p>
              
              <p>Nombre: ${name}</p>
              <p>Email: ${to}</p>
              <p>Número de referencia: ${code}</p>
              <p>Orden ID: ${orderId}</p>
              <a href="https://www.supplytechstore.com/order/${orderId}" class="button">Ver Orden</a>
              <p>Imagen de la transferencia:</p>
              <img src="${image}" width="200" style="height: auto;" alt="Imagen de la transferencia">
            </div>
          </div>
        </body>
      </html>
    `;
  }
};

const sendEmailHandler = async (data) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAdminUser,
      pass: passCodeGoogle,
    },
  });

  // Use the emailTemplate function to generate the HTML content
  if (data.admin) {
    var mailOptions = {
      from: emailAdminUser,
      to: data.to,
      subject: data.subject,
      html: emailTemplateAdmin(data), // Pass userName and any other data needed
    };
  } else if (data.typeEmail === "newSubscriber") {
    var mailOptions = {
      from: emailAdminUser,
      to: data.to,
      subject: data.subject,
      html: emailTemplateNewSubscriber(data), // Pass userName and any other data needed
    };
  } else {
    var mailOptions = {
      from: emailAdminUser,
      to: data.to,
      subject: data.subject,
      html: emailTemplate(data.name, "https://www.supplytechstore.com/profile"), // Pass userName and any other data needed
    };
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return;
};

export const paymentConfirmationEmail = async (data) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAdminUser,
      pass: passCodeGoogle,
    },
  });

  // Use the emailTemplate function to generate the HTML content
  var mailOptions = {
    from: emailAdminUser,
    to: data.to,
    subject: data.subject,
    html: emailTemplatePaymentConfirmation(data), // Pass userName and any other data needed
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return;
};

export const defaultEmail = async (data) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAdminUser,
      pass: passCodeGoogle,
    },
  });

  // Use the emailTemplate function to generate the HTML content
  var mailOptions = {
    from: emailAdminUser,
    to: data.to,
    subject: data.subject,
    html: defaultEmailTemplate(data), // Pass userName and any other data needed
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendEmailHandler;
