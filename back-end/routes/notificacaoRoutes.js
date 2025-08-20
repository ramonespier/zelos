// /routes/notificacaoRoutes.js

import NotificacaoController from "../controllers/NotificacaoController.js";
import Autorizar from "../middlewares/Autorizar.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import express from "express";

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    // Essa verificação extra é uma boa prática
    if (!req.user) {
        return res.status(401).json({ message: 'Acesso negado. Token não verificado.' });
    }
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

// GET /notificacao -> Listar todas as notificações do usuário
router.get('/',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    NotificacaoController.listar
);

// GET /notificacao/:id -> Buscar uma notificação por ID
router.get('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    NotificacaoController.buscarPorId
);

// ===== ROTA PATCH ADICIONADA =====
// PATCH /notificacao/:id/lida -> Marcar uma notificação específica como lida
router.patch('/:id/lida',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    NotificacaoController.marcarComoLida
);

// DELETE /notificacao/:id -> Deletar uma notificação específica
router.delete('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    NotificacaoController.deletar
);

// DELETE /notificacao -> Limpar TODAS as notificações
router.delete('/',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    NotificacaoController.limparTodas
);

export default router;