// /controllers/PedidoChamadoController.js

import PedidoChamado from '../entities/PedidoChamado.js';
import Chamado from '../entities/Chamado.js';
import Usuario from '../entities/Usuario.js';
import sequelize from '../configs/database.js'; // Importa a instância para transações

class PedidoChamadoController {
    
    // ROTA: POST /pedidos-chamado
    // Um técnico cria um novo pedido para se atribuir a um chamado.
    static async criar(req, res) {
        const { chamado_id } = req.body;
        const tecnico_id = req.user.id; // ID do técnico logado

        if (!chamado_id) {
            return res.status(400).json({ message: "O ID do chamado é obrigatório." });
        }
        
        try {
            const pedidoExistente = await PedidoChamado.findOne({
                where: { chamado_id, tecnico_id, status: 'pendente' }
            });

            if (pedidoExistente) {
                return res.status(409).json({ message: "Você já enviou um pedido para este chamado." });
            }

            const novoPedido = await PedidoChamado.create({
                chamado_id,
                tecnico_id,
            });
            res.status(201).json(novoPedido);
        } catch (error) {
            console.error("Erro ao criar pedido de chamado:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    // ROTA: GET /pedidos-chamado/meus-pedidos
    // Técnico busca a lista de IDs de chamados para os quais ele já enviou um pedido.
    static async listarPorTecnico(req, res) {
        const tecnico_id = req.user.id;
        
        try {
            const pedidos = await PedidoChamado.findAll({
                where: { tecnico_id },
                attributes: ['chamado_id']
            });

            const idsDosChamados = pedidos.map(p => p.chamado_id);
            res.json(idsDosChamados);
            
        } catch (error) {
            console.error("Erro ao listar pedidos do técnico:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    // ROTA: GET /pedidos-chamado/pendentes
    // Admin busca a lista de todos os pedidos que estão com status 'pendente'.
    static async listarPendentes(req, res) {
        try {
            const pedidos = await PedidoChamado.findAll({
                where: { status: 'pendente' },
                include: [
                    { 
                        model: Chamado, 
                        as: 'chamado',
                        attributes: ['id', 'titulo', 'numero_patrimonio']
                    },
                    {
                        model: Usuario,
                        as: 'tecnico',
                        attributes: ['id', 'nome']
                    }
                ],
                order: [['criado_em', 'ASC']]
            });
            res.json(pedidos);
        } catch (error) {
            console.error("Erro ao listar pedidos pendentes:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    // ROTA: PATCH /pedidos-chamado/:id/responder
    // Admin aceita ou recusa um pedido pendente.
    static async responderPedido(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        if (!['aceito', 'recusado'].includes(status)) {
            return res.status(400).json({ message: "Status inválido. Use 'aceito' ou 'recusado'." });
        }

        const t = await sequelize.transaction();

        try {
            const pedido = await PedidoChamado.findByPk(id, { transaction: t });
            if (!pedido) {
                await t.rollback();
                return res.status(404).json({ message: "Pedido não encontrado." });
            }
            if (pedido.status !== 'pendente') {
                await t.rollback();
                return res.status(409).json({ message: "Este pedido já foi respondido." });
            }

            if (status === 'aceito') {
                const chamado = await Chamado.findByPk(pedido.chamado_id, { transaction: t });
                if (!chamado) {
                    await t.rollback();
                    return res.status(404).json({ message: "O chamado associado não existe mais." });
                }
                if (chamado.tecnico_id) {
                    await t.rollback();
                    return res.status(409).json({ message: "Este chamado já foi atribuído a outro técnico." });
                }

                chamado.tecnico_id = pedido.tecnico_id;
                await chamado.save({ transaction: t });

                pedido.status = 'aceito';
                await pedido.save({ transaction: t });

                await PedidoChamado.update(
                    { status: 'recusado' },
                    { 
                        where: { 
                            chamado_id: pedido.chamado_id,
                            status: 'pendente'
                        },
                        transaction: t
                    }
                );
            } else {
                pedido.status = 'recusado';
                await pedido.save({ transaction: t });
            }

            await t.commit();
            res.json({ message: `Pedido ${status} com sucesso.` });
        } catch (error) {
            await t.rollback();
            console.error("Erro ao responder ao pedido:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    }
}

export default PedidoChamadoController;