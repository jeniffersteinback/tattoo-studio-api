# Tattoo Studio API

API Estúdio de Tatuagem
API para gerenciar clientes, tatuadores, agendamentos e envio de confirmações por e-mail.


## Endpoints

### Clientes
- `POST /api/clientes/register` – Cadastro de cliente + email de confirmação
- `POST /api/clientes/login` – Login + JWT

### Tatuadores
- `GET /api/tatuadores/` – Lista tatuadores e estilos

### Agendamentos
- `POST /api/agendamentos/agendar` – Criar agendamento (JWT + upload de imagem)

## Autenticação
Use o token JWT no header:
