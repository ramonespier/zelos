import Notificacao from '../entities/Notificacao.js';

class NotificacaoController {

  
    static async listar(req, res) {
        try {
            const { usuario_id } = req.query;
            const filtros = {};
            if (usuario_id) filtros.usuario_id = usuario_id;

            const notificacoes = await Notificacao.findAll({
                where: filtros,
                order: [['created_at', 'DESC']]
            });

            res.json(notificacoes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar notificações' });
        }
    }

  
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const notificacao = await Notificacao.findByPk(id);

            if (!notificacao) {
                return res.status(404).json({ message: 'Notificação não encontrada' });
            }

            res.json(notificacao);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar notificação' });
        }
    }

    // marcar notificação como lida
    static async marcarComoLida(req, res) {
        try {
            const { id } = req.params;
            const notificacao = await Notificacao.findByPk(id);

            if (!notificacao) {
                return res.status(404).json({ message: 'Notificação não encontrada' });
            }

            notificacao.status = 'lida';
            await notificacao.save();

            res.json(notificacao);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao atualizar notificação' });
        }
    }

    // deletar notificação individual
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const notificacao = await Notificacao.findByPk(id);

            if (!notificacao) {
                return res.status(404).json({ message: 'Notificação não encontrada' });
            }

            await notificacao.destroy();
            res.json({ message: 'Notificação deletada com sucesso' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao deletar notificação' });
        }
    }

    // limpar todas notificações de um usuário
    static async limparTodas(req, res) {
        try {
            const { usuario_id } = req.query;
            if (!usuario_id) {
                return res.status(400).json({ message: 'Informe o usuário para limpar notificações.' });
            }

            await Notificacao.destroy({ where: { usuario_id } });
            res.json({ message: 'Todas notificações do usuário foram deletadas.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao limpar notificações' });
        }
    }

}

export default NotificacaoController;
