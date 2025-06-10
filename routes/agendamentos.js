const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const nodemailer = require('nodemailer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

const agendamentos = [];

router.post('/agendar', auth, upload.single('imagem'), async (req, res) => {
  const { tatuador, data, hora, estilo } = req.body;
  const imagem = req.file?.filename;
  const userEmail = req.user.email;

  agendamentos.push({ tatuador, data, hora, estilo, imagem, cliente: req.user });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Agendamento Confirmado",
    text: `Seu agendamento com ${tatuador} para ${data} às ${hora} foi confirmado.`
  });

  res.json({ message: "Agendamento realizado com sucesso!" });
});

module.exports = router;
