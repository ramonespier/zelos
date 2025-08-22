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
    // /controllers/PedidoChamadoController.js

    static async listarPorTecnico(req, res) {
        const tecnico_id = req.user.id;

        try {
            const pedidos = await PedidoChamado.findAll({
                where: { tecnico_id },
                // MUDANÇA: Agora selecionamos o chamado_id e o status
                attributes: ['chamado_id', 'status']
            });

            // A resposta agora será um array de objetos, ex: [{ chamado_id: 1, status: 'pendente' }, { chamado_id: 2, status: 'recusado' }]
            res.json(pedidos);

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
        const { id } = req.params; // ID do pedido
        const { status } = req.body; // 'aceito' ou 'recusado'

        if (!['aceito', 'recusado'].includes(status)) {
            return res.status(400).json({ message: "Status inválido. Use 'aceito' ou 'recusado'." });
        }

        const t = await sequelize.transaction();

        try {
            // Busca o pedido de atribuição
            const pedido = await PedidoChamado.findByPk(id, { transaction: t });
            if (!pedido || pedido.status !== 'pendente') {
                await t.rollback();
                return res.status(409).json({ message: "Este pedido não foi encontrado ou já foi respondido." });
            }

            if (status === 'aceito') {
                const chamado = await Chamado.findByPk(pedido.chamado_id, { transaction: t });
                if (!chamado) {
                    await t.rollback();
                    return res.status(404).json({ message: "O chamado associado a este pedido não existe mais." });
                }
                if (chamado.tecnico_id) {
                    await t.rollback();
                    return res.status(409).json({ message: "Este chamado já foi atribuído a outro técnico enquanto o pedido estava pendente." });
                }

                // ===== A LÓGICA ATUALIZADA ESTÁ AQUI =====

                // 1. Atribui o técnico ao chamado principal
                chamado.tecnico_id = pedido.tecnico_id;

                // 2. ATUALIZA O STATUS DO CHAMADO para 'em andamento'
                chamado.status = 'em andamento';

                // 3. Salva as duas alterações no chamado de uma vez
                await chamado.save({ transaction: t });

                // ===========================================

                // 4. Atualiza o status do pedido atual para 'aceito'
                pedido.status = 'aceito';
                await pedido.save({ transaction: t });

                // 5. (Bônus) Recusa automaticamente todos os outros pedidos pendentes para o mesmo chamado
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

            } else { // Se o status for 'recusado'
                pedido.status = 'recusado';
                await pedido.save({ transaction: t });
            }

            // Se todas as operações foram bem-sucedidas, confirma a transação
            await t.commit();
            res.json({ message: `Pedido ${status} com sucesso.` });

        } catch (error) {
            // Se qualquer operação falhar, desfaz tudo
            await t.rollback();
            console.error("Erro ao responder ao pedido:", error);
            res.status(500).json({ message: "Erro interno no servidor ao processar o pedido." });
        }
    }
}

export default PedidoChamadoController;