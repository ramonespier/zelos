// /routes/notificacaoRoutes.js

import NotificacaoController from "../controllers/NotificacaoController.js";
import Autorizar from "../middlewares/Autorizar.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import express from "express";

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Acesso negado. Token não verificado.' });
    }
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

router.get('/',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    NotificacaoController.listar
);

router.get('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    NotificacaoController.buscarPorId
);

router.patch('/:id/lida',
    AuthMiddleware.verifyToken,
    NotificacaoController.marcarComoLida
);

router.delete('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    NotificacaoController.deletar
);

router.delete('/',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    NotificacaoController.limparTodas
);

export default router;