// /routes/pedidoChamadoRoutes.js CORRIGIDO

import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import Autorizar from "../middlewares/Autorizar.js";
import PedidoChamadoController from "../controllers/PedidoChamadoController.js";

const router = express.Router();
const autorizar = new Autorizar();

// A definição correta do helper 'permitir'
const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

// POST /pedidos-chamado
router.post('/', AuthMiddleware.verifyToken, permitir(['tecnico']), PedidoChamadoController.criar);

// GET /pedidos-chamado/meus-pedidos
router.get('/meus-pedidos', AuthMiddleware.verifyToken, permitir(['tecnico']), PedidoChamadoController.listarPorTecnico);

// GET /pedidos-chamado/pendentes
router.get('/pendentes', AuthMiddleware.verifyToken, permitir(['admin']), PedidoChamadoController.listarPendentes);

// PATCH /pedidos-chamado/:id/responder
router.patch('/:id/responder', AuthMiddleware.verifyToken, permitir(['admin']), PedidoChamadoController.responderPedido);

export default router;