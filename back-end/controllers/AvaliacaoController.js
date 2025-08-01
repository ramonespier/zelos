import Avaliacao from '../entities/Avaliacao.js';

class AvaliacaoController {

    static async listar(req, res) {
        try {
            const avaliacao = await Avaliacao.findAll();
            res.json(avaliacao);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao listar avaliações' });
            console.error(err)
        }
    }

    static async buscarPorid(req, res) {
        try {
            const { id } = req.params;
            const availiacao = await Avaliacao.findByPk(id);
            if (!availiacao) {
                return res.status(404).json({ message: 'Avaliação não encontrada' })
            }
            res.json(availiacao)
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar avaliação' })
        }
    }

    static async criar(req, res) {
        try {
            const { comentario, chamado_id, tecnico_id } = req.body;
            const avaliacao = await Avaliacao.create({
                comentario, chamado_id, tecnico_id
            })
            res.status(201).json(avaliacao);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar avaliação' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { comentario, chamado_id, tecnico_id } = req.body;
            const avaliacao = await Avaliacao.findByPk(id);
            if (!avaliacao) {
                return res.status(404).json({ message: 'Avaliação não encontrada' });
            }
            await avaliacao.update({
                comentario, chamado_id, tecnico_id
            })
            res.status(201).json(avaliacao);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao atualizar avaliação' })
        }
    }

    static async deletar(req, res) {
        try {
            const {id} = req.params;
            const avaliacao = await Avaliacao.findByPk(id);
            if(!avaliacao){
                return res.status(404).json({message: 'Avaliação não encontrada'});
            }
            await avaliacao.destroy();
            res.status(201).json({message: 'Avaliação deletada com sucesso'});
        } catch (err){
            res.status(500).json({message: 'Erro ao deletar avaliação'});
        }
    }
}

export default AvaliacaoController;