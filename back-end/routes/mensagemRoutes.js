// src/routes/mensagemRoutes.js
import express from 'express';
import { getMinhasMensagens, sendMensagem, getConversasAdmin, getMensagensPorUsuarioAdmin } from '../controllers/mensagemController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js'; // Use o seu middleware

const router = express.Router();

// ---- Rotas para Usuários Comuns ----

// Rota para um usuário buscar SUAS PRÓPRIAS mensagens.
// GET /mensagens/minhas
router.get('/minhas', AuthMiddleware.verifyToken, getMinhasMensagens);

// Rota para um usuário enviar uma mensagem.
// POST /mensagens
router.post('/', AuthMiddleware.verifyToken, sendMensagem);


// ---- Rotas para Administradores ----

// Rota para um admin ver a lista de todas as conversas ativas.
// GET /mensagens/conversas
router.get('/conversas', AuthMiddleware.verifyToken, getConversasAdmin);

// Rota para um admin buscar as mensagens de um USUÁRIO ESPECÍFICO.
// GET /mensagens/usuario/:usuarioId
router.get('/usuario/:usuarioId', AuthMiddleware.verifyToken, getMensagensPorUsuarioAdmin);

export default router;
