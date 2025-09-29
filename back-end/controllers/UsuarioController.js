import Usuario from "../entities/Usuario.js";

class UsuarioController {

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

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, funcao, especialidade } = req.body;
            
            const usuarioAutenticado = req.user;
            
            if (usuarioAutenticado.funcao !== 'admin' && usuarioAutenticado.id != id) {
                 return res.status(403).json({ message: 'Acesso negado. Você só pode atualizar o seu próprio perfil.' });
            }
            
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            let dadosParaAtualizar = {};
            
            if (usuarioAutenticado.funcao === 'admin') {
                dadosParaAtualizar = {
                    nome,
                    email,
                    funcao,
                    especialidade: funcao === 'tecnico' ? especialidade : null
                };
            } else {
                dadosParaAtualizar = {
                    especialidade: especialidade 
                };
            }

            await usuario.update(dadosParaAtualizar);

            res.json(usuario);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async alterarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            await usuario.update({ status });

            res.json(usuario);
        } catch (error) {
            console.error('Erro ao alterar status do usuário:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

}

export default UsuarioController;