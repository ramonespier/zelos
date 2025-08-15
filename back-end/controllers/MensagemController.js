import Mensagem from '../entities/Mensagem.js';
import Usuario from '../entities/Usuario.js';

class MensagemController {

    // usuário envia mensagem
    static async criar(req, res) {
        try {
            const { conteudo } = req.body;
            const usuario_id = req.user.id; // usuário logado

            if (!conteudo) {
                return res.status(400).json({ message: 'Conteúdo obrigatório' });
            }

            const mensagem = await Mensagem.create({
                remetente_id: usuario_id,
                conteudo,
                status: 'não lida'
            });

            res.status(201).json(mensagem);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao enviar mensagem' });
        }
    }

    // admin lista todas mensagens
    static async listar(req, res) {
        try {
            const mensagens = await Mensagem.findAll({
                include: ['remetente'],
                order: [['created_at', 'DESC']]
            });
            res.json(mensagens);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao listar mensagens' });
        }
    }

    // admin busca mensagem por ID
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const mensagem = await Mensagem.findByPk(id, { include: ['remetente'] });

            if (!mensagem) {
                return res.status(404).json({ message: 'Mensagem não encontrada' });
            }

            res.json(mensagem);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar mensagem' });
        }
    }


    // admin deleta mensagem
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const mensagem = await Mensagem.findByPk(id);

            if (!mensagem) return res.status(404).json({ message: 'Mensagem não encontrada' });

            await mensagem.destroy();
            res.json({ message: 'Mensagem deletada com sucesso' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao deletar mensagem' });
        }
    }
}

export default MensagemController;
