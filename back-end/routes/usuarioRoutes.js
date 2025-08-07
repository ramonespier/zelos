import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import Autorizar from "../middlewares/Autorizar.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

router.get('/',
    AuthMiddleware.verifyToken,
    // permitir(['admin']),
    UsuarioController.listar
);

router.get('/:id',
    AuthMiddleware.verifyToken,
    // permitir(['admin', 'usuario', 'tecnico']),
    UsuarioController.buscarPorId
);

export default router;