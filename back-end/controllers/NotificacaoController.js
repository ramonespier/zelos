// /controllers/NotificacaoController.js

import Notificacao from '../entities/Notificacao.js';

class NotificacaoController {

    // Listar notificações do usuário logado
    static async listar(req, res) {
        try {
            const usuario_id = req.user.id; 
            const notificacoes = await Notificacao.findAll({
                where: { usuario_id },
                order: [['criado_em', 'DESC']]
            });
            res.json(notificacoes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar notificações' });
        }
    }

    // Buscar notificação por ID (não muito usado no front-end, mas bom ter)
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const usuario_id = req.user.id;
            const notificacao = await Notificacao.findOne({
                where: { id, usuario_id }
            });

            if (!notificacao) {
                return res.status(404).json({ message: 'Notificação não encontrada' });
            }

            res.json(notificacao);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar notificação' });
        }
    }

    // ===== MÉTODO CORRIGIDO E ATIVADO =====
    // Marca uma única notificação como lida
    static async marcarComoLida(req, res) {
        try {
            const { id } = req.params;
            const usuario_id = req.user.id;
            const notificacao = await Notificacao.findOne({
                where: {
                    id: id,
                    usuario_id: usuario_id
                }
            });

            if (!notificacao) {
                return res.status(404).json({ message: 'Notificação não encontrada ou não pertence a você.' });
            }

            // CORREÇÃO: Altera a propriedade 'lida' para 'true'
            notificacao.lida = true;
            await notificacao.save();

            res.json(notificacao);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao marcar notificação como lida' });
        }
    }
    
    // Deletar uma notificação específica
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const usuario_id = req.user.id;
            const notificacao = await Notificacao.findOne({
                where: { id, usuario_id }
            });

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

    // Limpar TODAS as notificações do usuário
    static async limparTodas(req, res) {
        try {
            const usuario_id = req.user.id;
            await Notificacao.destroy({ where: { usuario_id } });
            res.json({ message: 'Todas as suas notificações foram deletadas.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao limpar notificações' });
        }
    }
}

export default NotificacaoController;