import Apontamento from '../entities/Apontamento.js'

class ApontamentoController {

    static async listar(req, res) {
        try {
            const apontamento = await Apontamento.findAll();
            res.json(apontamento);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao listar apontamento' });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const apontamento = await Apontamento.findByPk(id);
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
            const { comeco, fim, descricao, duracao, chamado_id, tecnico_id } = req.body;
            const apontamento = await Apontamento.create({
                comeco, fim, descricao, duracao, chamado_id, tecnico_id
            })
            res.status(200).json(apontamento);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar apontamento' })
        }
    }

    // PROVALVEMNTE IREI RETIRAR
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { comeco, fim, descricao, duracao, chamado_id, tecnico_id } = req.body;
            const apontamento = await Apontamento.findByPk(id);
            if(!apontamento){
                return res.status(404).json({message: 'Apontamento não encontrado'})
            }
            await apontamento.update({
                comeco, fim, descricao, duracao, chamado_id, tecnico_id
            })
            res.json(apontamento);
        } catch (err){
            res.status(500).json({message: 'Erro ao atualizar apontamento'});
        }
    }

    static async deletar(req, res){
        try{
            const {id} = req.params;
            const apontamento = await Apontamento.findByPk(id);
            if(!apontamento){
                return res.status(404).json({message: 'Apontamento não encontrado'})
            }
            await apontamento.destroy();
            res.status(200).json({message: 'Apontamento deletado com sucesso'});
        } catch (err){
            res.status(500).json({message: 'Erro ao deletar apontamento'});
        }
    }

}

export default ApontamentoController;