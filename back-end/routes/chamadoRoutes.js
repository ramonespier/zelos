import ChamadoController from "../controllers/ChamadoController.js";
import express from "express";

const router = express.Router();

router.get('/', ChamadoController.listar);
router.get('/:id', ChamadoController.buscarPorId);
router.post('/', ChamadoController.criar);
router.put('/:id', ChamadoController.atualizar);
router.delete('/:id', ChamadoController.deletar);

export default router;