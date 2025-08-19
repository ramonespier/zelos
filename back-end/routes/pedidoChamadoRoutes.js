import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import PedidoChamadoController from "../controllers/PedidoChamadoController.js";

const router = express.Router();

// apenas técnicos podem criar pedidos de chamado
router.post('/', AuthMiddleware.verifyToken, PedidoChamadoController.criar);
router.get('/meus-pedidos', AuthMiddleware.verifyToken, PedidoChamadoController.listarPorTecnico);

export default router;