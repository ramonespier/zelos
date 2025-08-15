import MensagemController from "../controllers/MensagemController.js";
import Autorizar from "../middlewares/Autorizar.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import express from "express";

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}


router.get('/',
    AuthMiddleware.verifyToken,
    permitir(['admin']),
    MensagemController.listar
);


router.get('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario', 'tecnico']),
    MensagemController.buscarPorId
);


router.post('/',
    AuthMiddleware.verifyToken,
    permitir(['usuario', 'tecnico']),
    MensagemController.criar
);

router.delete('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin']),
    MensagemController.deletar
);

export default router;
