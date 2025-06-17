require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const clienteRoutes = require('./routes/clientes');
const agendamentoRoutes = require('./routes/agendamentos');
const tatuadorRoutes = require('./routes/tatuadores');
const confirmacaoRoutes = require('./routes/confirmacao');

const app = express();

app.use(express.json());

// Servir arquivos estáticos (ex: imagens enviadas)
app.use('/uploads', express.static('uploads'));

// Rotas da API
app.use('/api/clientes', clienteRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/tatuadores', tatuadorRoutes);
app.use('/api/confirmacao-agendamento', confirmacaoRoutes);

// Rota raiz (teste)
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Bem-vindo à nossa API" });
});

// Rota para envio de e-mail (exemplo)
app.post('/send', async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.umbler.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // ou req.body.email do cliente
        replyTo: "contato@cliente.com",
        subject: "Agendamento realizado",
        text: "Olá, seu agendamento foi realizado com sucesso!"
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'E-mail enviado com sucesso!', info });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar e-mail', error });
    }
});
const uploadRoutes = require('./routes/uploads'); // 👈 adicionado
app.use('/api', uploadRoutes); // 👈 adicionado

// Rota raiz (teste)
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Bem-vindo à nossa API" });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});