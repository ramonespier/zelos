// src/routes/mensagemRoutes.js
import express from 'express';
import { getMinhasMensagens, sendMensagem, getConversasAdmin, getMensagensPorUsuarioAdmin } from '../controllers/mensagemController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';
const router = express.Router();

router.get('/minhas', AuthMiddleware.verifyToken, getMinhasMensagens);
router.post('/', AuthMiddleware.verifyToken, sendMensagem);

// ---- Rotas para Administradores ----
router.get('/conversas', AuthMiddleware.verifyToken, getConversasAdmin);
router.get('/usuario/:usuarioId', AuthMiddleware.verifyToken, getMensagensPorUsuarioAdmin);

export default router;
