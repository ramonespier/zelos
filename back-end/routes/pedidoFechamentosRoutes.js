import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import Autorizar from "../middlewares/Autorizar.js";
import PedidoFechamentoController from "../controllers/PedidoFechamentoController.js";

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

router.get('/',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'tecnico']),
    PedidoFechamentoController.listar
);

router.post('/',
    AuthMiddleware.verifyToken,
    permitir(['tecnico']),
    PedidoFechamentoController.criar
);

router.get('/pendentes',
    AuthMiddleware.verifyToken,
    permitir(['admin']),
    PedidoFechamentoController.listarPendentes
);

router.patch('/:id/responder',
    AuthMiddleware.verifyToken,
    permitir(['admin']),
    PedidoFechamentoController.responder
);

export default router;