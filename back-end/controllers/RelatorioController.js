import Relatorio from '../entities/Relatorio.js'

class RelatorioController {

    static async listar(req, res){
        try{
            const relatorio = await Relatorio.findAll();
            res.json(relatorio);
        } catch (err){
            res.status(500).json({message: 'Erro ao buscar relátorio'});
        }
    }
}

export default RelatorioController;