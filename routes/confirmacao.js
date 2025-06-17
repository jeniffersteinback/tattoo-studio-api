const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.umbler.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

router.post('/', async (req, res) => {
  const { nomeCliente, emailCliente, data, hora, tatuador, estilo } = req.body;

  if (!nomeCliente || !emailCliente || !data || !hora || !tatuador) {
    return res.status(400).json({ message: 'Dados do agendamento incompletos.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailCliente,
    subject: "Confirmação do seu agendamento",
    text: `Olá ${nomeCliente},

Seu agendamento foi confirmado com os seguintes detalhes:

- Data: ${data}
- Hora: ${hora}
- Tatuador: ${tatuador}
- Estilo: ${estilo || 'Não especificado'}

Aguardamos você!

Atenciosamente,
Estúdio de Tatuagem
`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'E-mail de confirmação enviado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar e-mail', error });
  }
});

module.exports = router;
