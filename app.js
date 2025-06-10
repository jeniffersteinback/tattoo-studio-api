require('dotenv').config();
const express = require('express');
const clienteRoutes = require('./routes/clientes');
const agendamentoRoutes = require('./routes/agendamentos');
const tatuadorRoutes = require('./routes/tatuadores');

const app = express(); // Precisa vir antes de qualquer uso do `app`

app.use(express.json());

// Servir arquivos estáticos (ex: imagens enviadas)
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/clientes', clienteRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/tatuadores', tatuadorRoutes);

// Rota raiz (teste)
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Bem-vindo à nossa API" });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});