import express from "express";
import AvaliacaoController from "../controllers/AvaliacaoController.js";

const router = express.Router();

router.get('/', AvaliacaoController.listar);
router.get('/:id', AvaliacaoController.buscarPorid);
router.post('/', AvaliacaoController.criar);
router.put('/:id', AvaliacaoController.atualizar);
router.delete('/:id', AvaliacaoController.deletar);

export default router;