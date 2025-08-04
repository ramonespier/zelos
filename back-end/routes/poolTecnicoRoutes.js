import express from "express";
import PoolTecnicoController from "../controllers/PoolTecnicoController.js";

const router = express.Router();

router.get('/', PoolTecnicoController.listar);
router.get('/:id', PoolTecnicoController.buscarPorId);
router.post('/', PoolTecnicoController.criar);
router.put('/:id', PoolTecnicoController.atualizar);
router.delete('/:id', PoolTecnicoController.deletar);

export default router;