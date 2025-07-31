import Usuario from "../entities/Usuario.js";

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

    // buscar user por id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            };
            res.status(201).json(usuario)
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar usuário' });
        }
    }

    // criar novo user
    static async criar(req, res) {
        try {
            const { nome, email, senha, funcao, status } = req.body;
            const novoUsuario = await Usuario.create({ nome, email, senha, funcao, status });
            res.status(201).json(novoUsuario);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar usuário' });
        }
    }

    // atualizar user
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, funcao, status } = req.body;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            await usuario.update({ nome, email, senha, funcao, status });
            res.json(usuario);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao atualizar usuário' });
        }
    }

    // deletar user
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            await usuario.destroy();
            res.json({ message: 'Usuário deletado com sucesso' });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao deletar usuário' });
        }
    }

}

export default UsuarioController;   