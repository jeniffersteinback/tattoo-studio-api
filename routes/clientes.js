const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();
const clientes = []; // Simulação de "banco de dados"
const SECRET = process.env.JWT_SECRET;

// Configurar transporter do Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.umbler.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//  Cadastro (register)
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
  }

  const hashed = await bcrypt.hash(senha, 10);
  const novoCliente = { id: clientes.length + 1, nome, email, senha: hashed };
  clientes.push(novoCliente);

  // Envia e-mail de confirmação
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Cadastro confirmado",
      text: `Olá ${nome}, seu cadastro foi realizado com sucesso!`
    });

    res.json({ message: "Cadastro realizado com sucesso!", cliente: { id: novoCliente.id, nome, email } });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar e-mail", error });
  }
});

//  Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const cliente = clientes.find(c => c.email === email);
  if (!cliente || !(await bcrypt.compare(senha, cliente.senha))) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const token = jwt.sign({ id: cliente.id, email: cliente.email }, SECRET, { expiresIn: '1h' });
  res.json({ message: "Login realizado", token });
});

module.exports = router;