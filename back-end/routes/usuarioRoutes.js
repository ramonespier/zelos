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
    permitir(['admin']),
    UsuarioController.listar
);

router.get('/:id',
    UsuarioController.criar
);

router.post('/',
    
    UsuarioController.criar
);

router.put('/:id',
    AuthMiddleware.verifyToken,
    permitir(['usuario', 'admin', 'tecnico']), // só pode trocar a senha e NO MAXIMO A FOTO 
    UsuarioController.atualizar);

router.delete('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin']),
    UsuarioController.deletar
);

export default router;