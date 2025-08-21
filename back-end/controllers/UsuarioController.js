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

    // edita especialidade (apenas do técnico)
    static async editarEspecialidade(req, res) {
        try {
            const { id } = req.params;
            const { especialidade } = req.body;

            // busca o técnico
            const tecnico = await Usuario.findByPk(id);
            if (!tecnico) {
                return res.status(404).json({ message: 'Técnico não encontrado' });
            }

            // garante que o usuário seja realmente um técnico
            if (tecnico.funcao !== 'tecnico') {
                return res.status(400).json({ message: 'Usuário não é um técnico.' });
            }

            // atualiza a especialidade
            await tecnico.update({ especialidade });
            await tecnico.reload();

            res.json(tecnico);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao editar especialidade' });
        }
    }


}

export default UsuarioController;   