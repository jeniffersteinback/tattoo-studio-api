const express = require('express');
const router = express.Router();

// Simulando banco de dados em memória
const agendamentos = [];
let proximoId = 1;

// (Opcional) Middleware de autenticação JWT
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, SECRET, (err, cliente) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.cliente = cliente; // cliente.id e cliente.email disponíveis
    next();
  });
}

// Rota POST para criar agendamento
router.post('/', autenticarToken, (req, res) => {
  const { data, hora, tatuadorId } = req.body;

  if (!data || !hora || !tatuadorId) {
    return res.status(400).json({ message: 'Data, hora e tatuadorId são obrigatórios' });
  }

  const novoAgendamento = {
    id: proximoId++,
    data,
    hora,
    tatuadorId,
    clienteId: req.cliente.id,
    confirmado: false
  };

  agendamentos.push(novoAgendamento);
  res.status(201).json({
    message: 'Agendamento realizado com sucesso',
    agendamento: novoAgendamento
  });
});

module.exports = router;
