import PatrimonioController from "../controllers/PatrimonioController.js";
import express from "express";

const router = express.Router();

router.get('/', PatrimonioController.listar);
router.get('/:id', PatrimonioController.buscarPorid);
router.post('/', PatrimonioController.criar);
router.put('/:id', PatrimonioController.atualizar);
router.delete('/:id', PatrimonioController.deletar);

export default router;