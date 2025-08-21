import PedidoFechamento from '../entities/PedidoFechamento.js';
import Chamado from '../entities/Chamado.js';
import sequelize from '../configs/database.js';

class PedidoFechamentoController {
    
    // ROTA: POST /pedidos-fechamento
    static async criar(req, res) {
        const { chamado_id } = req.body;
        const tecnico_id = req.user.id;
        
        try {
            const pedidoExistente = await PedidoFechamento.findOne({ where: { chamado_id } });
            if (pedidoExistente) {
                return res.status(409).json({ message: "Já existe um pedido de fechamento para este chamado." });
            }

            const novoPedido = await PedidoFechamento.create({ chamado_id, tecnico_id });
            res.status(201).json(novoPedido);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao criar pedido de fechamento." });
        }
    }
    
    // ROTA: GET /pedidos-fechamento/pendentes
    static async listarPendentes(req, res) {
        try {
            const pedidos = await PedidoFechamento.findAll({
                where: { status: 'pendente' },
                include: ['chamado', 'tecnico']
            });
            res.json(pedidos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao listar pedidos pendentes." });
        }
    }
    
    // ROTA: PATCH /pedidos-fechamento/:id/responder
    static async responder(req, res) {
        const { id } = req.params;
        const { status } = req.body; // 'aprovado' ou 'reprovado'

        if (!['aprovado', 'reprovado'].includes(status)) {
            return res.status(400).json({ message: "Status inválido." });
        }
        
        const t = await sequelize.transaction();

        try {
            const pedido = await PedidoFechamento.findByPk(id, { transaction: t });
            if (!pedido || pedido.status !== 'pendente') {
                await t.rollback();
                return res.status(404).json({ message: "Pedido não encontrado ou já respondido." });
            }

            if (status === 'aprovado') {
                // APROVADO: Muda o status do CHAMADO para 'concluido'
                await Chamado.update({ status: 'concluido' }, {
                    where: { id: pedido.chamado_id },
                    transaction: t
                });
            }

            pedido.status = status; // Atualiza o status do PEDIDO
            await pedido.save({ transaction: t });

            await t.commit();
            res.json({ message: `Pedido ${status} com sucesso!` });
        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(500).json({ message: "Erro ao responder ao pedido." });
        }
    }
}

export default PedidoFechamentoController;