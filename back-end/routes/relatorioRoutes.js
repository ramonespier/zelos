import express from "express";
import RelatorioController from "../controllers/RelatorioController.js";

const router = express.Router();

router.get('/', RelatorioController.listar);

export default router;
