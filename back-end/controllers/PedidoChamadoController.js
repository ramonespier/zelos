import PedidoChamado from '../entities/PedidoChamado.js';

class PedidoChamadoController {
    static async criar(req, res) {
        const { chamado_id } = req.body;
        const tecnico_id = req.user.id;

        if (!chamado_id) {
            return res.status(400).json({ message: "O ID do chamado é obrigatório." });
        }
        
        try {
            const pedidoExistente = await PedidoChamado.findOne({
                where: { chamado_id, tecnico_id }
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

    static async listarPorTecnico(req, res) {
        const tecnico_id = req.user.id; // Pegamos o ID do técnico logado
        
        try {
            const pedidos = await PedidoChamado.findAll({
                where: { tecnico_id },
                attributes: ['chamado_id'] // Só precisamos da lista de IDs dos chamados
            });

            // Mapeamos para retornar um array simples de números: [1, 5, 12]
            const idsDosChamados = pedidos.map(p => p.chamado_id);
            res.json(idsDosChamados);
            
        } catch (error) {
            console.error("Erro ao listar pedidos do técnico:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    
}

export default PedidoChamadoController;