import Chamado from '../entities/Chamado.js';
import Usuario from '../entities/Usuario.js';
import Equipamento from '../entities/Equipamento.js';

class ChamadoController {

    // lista de chamados
    static async listar(req, res) {
        try {
            const chamados = await Chamado.findAll({
                include: ['tecnico', 'pool']
            });
            res.json(chamados);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar chamados' });
        }
    }

    // buscar por id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            // inclui dados do técnico e da pool
            const chamado = await Chamado.findByPk(id, {
                include: [
                    { association: 'tecnico', required: false }, // técnico pode ser null
                    { association: 'pool' }
                ]
            });

            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }

            res.json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar chamado' });
        }
    }


    static async criar(req, res) {
        try {
            const { titulo, numero_patrimonio, descricao, pool_id } = req.body;

            if (!numero_patrimonio || !pool_id || !titulo || !descricao) {
                return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
            }

            const equipamento = await Equipamento.findByPk(numero_patrimonio);
            
            if (!equipamento) {
                return res.status(404).json({ message: `Equipamento com o patrimônio "${numero_patrimonio}" não foi encontrado.` });
            }


            const chamadoExistente = await Chamado.findOne({
                where: {
                    numero_patrimonio,
                    status: 'aberto'
                }
            });

            if (chamadoExistente) {
                return res.status(400).json({ message: 'Já existe um chamado aberto para este número de patrimônio' });
            }

            const chamado = await Chamado.create({
                titulo,
                numero_patrimonio,
                descricao,
                usuario_id: req.user.id,
                pool_id
            });

            res.status(201).json(chamado);
        } catch (err) {
            
            console.error(err);
            res.status(500).json({ message: 'Ocorreu um erro interno ao criar o chamado' });
        }
    }
    

    // atribuir chamado para um técnico
    static async atribuir(req, res) {
        try {
            const { id } = req.params;
            const { tecnico_id } = req.body;
            const chamado = await Chamado.findByPk(id);

            if (!chamado) return res.status(404).json({ message: 'Chamado não encontrado' });
            if (chamado.tecnico_id) return res.status(400).json({ message: 'Chamado já está atribuído a um técnico' });

            const tecnico = await Usuario.findByPk(tecnico_id);
            if (!tecnico) return res.status(404).json({ message: 'Técnico não encontrado' });

            await chamado.update({ tecnico_id });
            await chamado.reload();
            res.status(200).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao atualizar chamado" });
        }
    }

    // atualizar status do chamado 
    static async status(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const chamado = await Chamado.findByPk(id);

            if (!chamado) return res.status(404).json({ message: 'Chamado não encontrado' });

            await chamado.update({ status });
            await chamado.reload();
            res.status(200).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao atualizar status do chamado" });
        }
    }

    // fechar chamado (só se estiver em andamento)
    static async fechar(req, res) {
        try {
            const { id } = req.params;
            const chamado = await Chamado.findByPk(id);

            if (!chamado) return res.status(404).json({ message: 'Chamado não encontrado' });
            if (chamado.status !== 'em andamento') return res.status(400).json({ message: 'Chamado não está em andamento' });

            await chamado.update({ status: 'concluido' });
            await chamado.reload();
            res.status(200).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao fechar chamado" });
        }
    }

}

export default ChamadoController;
