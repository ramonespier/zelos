import Apontamento from '../entities/Apontamento.js'
import Chamado from '../entities/Chamado.js';

class ApontamentoController {

    static async listar(req, res) {
        try {
            const apontamento = await Apontamento.findAll({
                include: ['chamado', 'tecnico']
            });
            res.json(apontamento);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao listar apontamento' });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const apontamento = await Apontamento.findByPk(id, { include: ['chamado', 'tecnico'] });
            if (!apontamento) {
                res.status(404).json({ message: 'Apontamento não encontrado' });
            }
            res.json(apontamento);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar apontamento' })
        }
    }

    static async criar(req, res) {
        try {
            const { comeco, fim, descricao, chamado_id, tecnico_id } = req.body;

            // validação de campos obrigatórios
            if (!comeco || !descricao || !chamado_id || !tecnico_id) {
                return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
            }

            // verifica se o chamado existe
            const chamado = await Chamado.findByPk(chamado_id);
            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }

            // verifica se o chamado está atribuído ao técnico
            if (chamado.tecnico_id !== tecnico_id) {
                return res.status(403).json({ message: 'Chamado não está atribuído a este técnico' });
            }

            // verifica se o chamado está em andamento
            if (chamado.status !== 'em andamento') {
                return res.status(400).json({ message: 'Chamado não está em andamento' });
            }

            // cria o apontamento
            const apontamento = await Apontamento.create({
                chamado_id,
                tecnico_id,
                descricao,
                comeco,
                fim
            });

            // retorna o apontamento com dados relacionados
            const apontamentoCompleto = await Apontamento.findByPk(apontamento.id, {
                include: ['chamado', 'tecnico']
            });

            res.status(201).json(apontamentoCompleto);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao criar apontamento' });
        }
    }



}

export default ApontamentoController;   