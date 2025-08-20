import express from "express";
import PoolController from "../controllers/PoolController.js";
// --- IMPORTAÇÕES NECESSÁRIAS PARA PROTEÇÃO ---
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import Autorizar from "../middlewares/Autorizar.js";

const router = express.Router();
const autorizar = new Autorizar();

// Helper para criar o middleware de permissão
const permitir = (perfisPermitidos) => (req, res, next) => {
    return autorizar.autorizacao(req.user, perfisPermitidos)(req, res, next);
}


// ROTA PARA LISTAR TODAS AS POOLS
router.get('/',
    AuthMiddleware.verifyToken, // 1. Verifica se o usuário está logado
    permitir(['admin', 'tecnico', 'usuario']), // 2. Permite o acesso a qualquer usuário logado
    PoolController.listar
);

// ROTA PARA BUSCAR UMA ÚNICA POOL POR ID
router.get('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'tecnico', 'usuario']), // Qualquer um pode ver os detalhes
    PoolController.buscarPorId
);

// ROTA PARA CRIAR UMA NOVA POOL
router.post('/',
    AuthMiddleware.verifyToken,
    permitir(['admin', 'usuario']), // Apenas admins ou usuários podem propor novas pools
    PoolController.criar
);

// ROTA PARA ADMIN APROVAR OU REJEITAR UMA POOL
router.patch('/status/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin']), // Apenas admins podem mudar o status
    PoolController.aprovarOuRejeitar
);

// ROTA PARA DELETAR UMA POOL
router.delete('/:id',
    AuthMiddleware.verifyToken,
    permitir(['admin']), // Apenas admins podem deletar
    PoolController.deletar
);

export default router;