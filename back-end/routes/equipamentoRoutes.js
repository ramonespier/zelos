import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import Autorizar from "../middlewares/Autorizar.js";
import EquipamentoController from '../controllers/EquipamentoController.js';

const router = express.Router();
const autorizar = new Autorizar();

const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}

// GET /equipamentos -> Listar todos
router.get('/',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'tecnico', 'usuario']), // Todos podem ver a lista para abrir chamados
    EquipamentoController.listar
);

// POST /equipamentos -> Criar um novo
router.post('/',
    AuthMiddleware.verifyToken,
    permitir(['admin']), // Apenas admins podem criar
    EquipamentoController.criar
);

// PATCH /equipamentos/:patrimonio -> Atualizar
router.patch('/:patrimonio',
    AuthMiddleware.verifyToken,
    permitir(['admin']), // Apenas admins podem editar
    EquipamentoController.atualizar
);

// DELETE /equipamentos/:patrimonio -> Deletar
router.delete('/:patrimonio',
    AuthMiddleware.verifyToken,
    permitir(['admin']), // Apenas admins podem deletar
    EquipamentoController.deletar
);

export default router;