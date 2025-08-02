import Patrimonio from "../entities/Patrimonio.js";

class PatrimonioController {

    static async listar(req, res) {
        try {
            const patrimonios = await Patrimonio.findAll();
            res.json(patrimonios);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar patrimonios' })
        }
    }

    static async buscarPorid(req, res) {
        try {
            const { id } = req.params;
            const patrimonios = await Patrimonio.findByPk(id);
            if (!patrimonios) {
                return res.status(404).json({ message: 'Patrimonio não encontrado' });
            }
            res.json(patrimonios);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar patrimonio' });
        }
    }

    static async criar(req, res) {
        try {
            const { nome, numero_serie, criado_em } = req.body;
            const patrimonio = await Patrimonio.create({
                nome,
                numero_serie,
                criado_em
            })
            res.json(patrimonio);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar patrimonio' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, numero_serie, criado_em } = req.body;
            const patrimonio = await patrimonio.findByPk(id);
            if(!patrimonio){
                return res.status(404).json({message: 'Patrimonio não encontrado'});
            }
            await patrimonio.update({
                nome,
                numero_serie,
                criado_em
            })
            res.json(patrimonio);
        } catch (e) {
            res.status(500).json({message: 'Erro ao atualizar patrimonio'});
        }
    }

    static async deletar(req, res){
        try{
            const {id} = req.params;
            const patrimonio = await Patrimonio.findByPk(id);
            if(!patrimonio){
                return res.status(500).json({message: 'Patrimonio não encontrado'});
            }
            await patrimonio.destroy();
            res.status(200).json({message: 'Patrimonio deletado com sucesso'});
        } catch (err){
            res.status(500).json({message: 'Erro ao deletar patrimonio'});
        }
    }
}

export default PatrimonioController;