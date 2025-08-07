import ChamadoController from "../controllers/ChamadoController.js";
import Autorizar from "../middlewares/Autorizar.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import express from "express";

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

router.get('/',
    // AuthMiddleware.verifyToken,
    // permitir(['admin']),
    ChamadoController.listar
);

router.get('/:id',
    AuthMiddleware.verifyToken,
    // permitir(['usuario', 'admin', 'tecnico']),
    ChamadoController.buscarPorId
);

router.post('/',
    // AuthMiddleware.verifyToken,
    // permitir(['usuario', 'admin']),
    ChamadoController.criar
);

router.patch('/:id/atribuir',
    // AuthMiddleware.verifyToken,         
    // permitir(['admin']),
    ChamadoController.atribuir
);

export default router;