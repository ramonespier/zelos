import express from 'express';
import ApontamentoController from '../controllers/ApontamentoController.js';

const router = express.Router();

router.get('/', ApontamentoController.listar);
router.get('/:id', ApontamentoController.buscarPorId);
router.post('/', ApontamentoController.criar);
router.delete('/:id', ApontamentoController.deletar);

export default router;