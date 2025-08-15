import EquipamentoController from "../controllers/EquipamentoController.js";
import Autorizar from "../middlewares/Autorizar.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import express, { Router } from "express";

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

router.get("/",
     AuthMiddleware.verifyToken,
    permitir(['admin', 'tecnico']),
    EquipamentoController.listar
);

router.get("/:id", AuthMiddleware.verifyToken,
    permitir(['admin', 'tecnico']),
    EquipamentoController.buscarPorPatrimonio
);

router.post("/", AuthMiddleware.verifyToken,
    permitir(['admin']), EquipamentoController.criar
);

router.put("/:id", AuthMiddleware.verifyToken,
    permitir(['admin']),
    EquipamentoController.atualizar);

router.delete("/:id", AuthMiddleware.verifyToken,
    permitir(['admin']),
    EquipamentoController.deletar
);

export default router;