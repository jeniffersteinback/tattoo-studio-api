const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// Banco simulado
const clientes = [];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hashed = await bcrypt.hash(senha, 10);
  clientes.push({ id: clientes.length + 1, nome, email, senha: hashed });

  // Envia confirmação
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Cadastro confirmado",
    text: `Olá ${nome}, seu cadastro foi realizado com sucesso!`
  });

  res.json({ message: "Cadastro realizado." });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const cliente = clientes.find(u => u.email === email);
  if (!cliente || !(await bcrypt.compare(senha, cliente.senha))) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const token = jwt.sign({ id: cliente.id, email: cliente.email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
