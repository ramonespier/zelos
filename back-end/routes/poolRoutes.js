import PoolController from "../controllers/PoolController.js";
import express from "express";

const router = express.Router();

// ## precisa ter um user criado para poder criar pool. ##

router.get('/', PoolController.listar);
router.get('/:id', PoolController.buscarPorId);
router.post('/', PoolController.criar);
router.delete('/:id', PoolController.deletar);

export default router;