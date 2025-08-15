import PoolController from "../controllers/PoolController.js";
import express from "express";

const router = express.Router();


router.get('/', PoolController.listar);
router.get('/:id', PoolController.buscarPorId);
router.post('/', PoolController.criar);
router.patch('/status/:id', PoolController.aprovarOuRejeitar);
router.delete('/:id', PoolController.deletar);

export default router;