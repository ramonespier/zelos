import express from "express";
import PoolController from "../controllers/PoolController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import Autorizar from "../middlewares/Autorizar.js";

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

router.get('/',
    AuthMiddleware.verifyToken, 
    permitir(['admin', 'tecnico', 'usuario']), 
    PoolController.listar
);

router.get('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'tecnico', 'usuario']), 
    PoolController.buscarPorId
);

router.post('/',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario']), 
    PoolController.criar
);

router.patch('/status/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin']), 
    PoolController.aprovarOuRejeitar
);

router.delete('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin']), 
    PoolController.deletar
);

export default router;