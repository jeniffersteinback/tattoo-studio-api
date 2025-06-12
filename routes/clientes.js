const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const router = express.Router();

const saltRounds = 10;
const SECRET = process.env.JWT_SECRET;

// Banco simulado (mantém dados enquanto o servidor roda)
const clientes = [];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota de cadastro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
    }

    // Verifica se email já existe
    if (clientes.find(c => c.email === email)) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const hashed = await bcrypt.hash(senha, saltRounds);
    const novoCliente = { id: clientes.length + 1, nome, email, senha: hashed };
    clientes.push(novoCliente);

    // Envia email de confirmação
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Cadastro confirmado",
      text: `Olá ${nome}, seu cadastro foi realizado com sucesso!`
    });

    res.json({ message: "Cadastro realizado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const cliente = clientes.find(u => u.email === email);
    if (!cliente) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: cliente.id, email: cliente.email }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

module.exports = router;
