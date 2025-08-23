import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import Autorizar from "../middlewares/Autorizar.js";
import EquipamentoController from '../controllers/EquipamentoController.js';

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

router.get('/',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'tecnico', 'usuario']),
    EquipamentoController.listar
);

router.post('/',
    AuthMiddleware.verifyToken,
    permitir(['admin']),
    EquipamentoController.criar
);

router.patch('/:patrimonio',
    AuthMiddleware.verifyToken,
    permitir(['admin']),
    EquipamentoController.atualizar
);

router.delete('/:patrimonio',
    AuthMiddleware.verifyToken,
    permitir(['admin']),
    EquipamentoController.deletar
);

export default router;