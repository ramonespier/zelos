import express from 'express';
import Autorizar from "../middlewares/Autorizar.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import ApontamentoController from '../controllers/ApontamentoController.js';

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

router.get('/',
    // AuthMiddleware.verifyToken,
    // permitir(['admin']),
    ApontamentoController.listar
);

router.get('/:id',
    // AuthMiddleware.verifyToken,
    // permitir(['admin', 'tecnico']),
    ApontamentoController.buscarPorId
);

router.post('/',
    // AuthMiddleware.verifyToken,
    // permitir(['tecnico']),
    ApontamentoController.criar
);

router.patch('/:id',
    // AuthMiddleware.verifyToken,
    // permitir(['tecnico']),
    ApontamentoController.fechar
);



export default router;