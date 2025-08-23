import Usuario from "../entities/Usuario.js";
import bcrypt from "bcryptjs";

class UsuarioController {

    // listando users
    static async listar(req, res) {
        try {
            const usuarios = await Usuario.findAll();
            res.json(usuarios);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar usuários' });
        }
    }

    static async listarTecnicos(req, res) {
        try {
            const tecnicos = await Usuario.findAll({
                where: { funcao: 'tecnico' }
            });
            res.json(tecnicos);
        } catch (err) {
            console.error("Erro ao listar técnicos:", err);
            res.status(500).json({ message: 'Erro ao buscar técnicos' });
        }
    }
    // buscar user por id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            };
            res.status(200).json(usuario)
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar usuário' });
        }
    }
}

export default UsuarioController;   