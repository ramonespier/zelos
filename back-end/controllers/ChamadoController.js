import Chamado from '../entities/Chamado.js'

class ChamadoController {

    static async listar(req, res) {
        try {
            const chamado = await Chamado.findAll();
            res.json(chamado)
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar chamados' })
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const chamado = await Chamado.findByPk(id);
            if (!chamado) {
                res.status(404).json({ message: 'Chamado não encontrado' })
            }
            res.json(chamado);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar chamado' })
        }
    }

    static async criar(req, res) {
        try {
            const { titulo, numero_patrimonio, descricao, status, usuario_id, tipo_id, } = req.body;
            const chamado = await Chamado.create({
                titulo,
                numero_patrimonio,
                descricao,
                status,
                usuario_id,
                tipo_id
            })
            res.status(201).json(chamado);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar chamado' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { tecnico_id } = req.body;
            const chamado = await Chamado.findByPk(id);
            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }

            await chamado.update({tecnico_id});
            res.status(200).json(chamado);
        } catch (err){
            res.status(500).json({message: "Erro ao atualiar chamado"})
        }
    }

    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const chamado = await Chamado.findByPk(id);
            if (!chamado) {
                res.status(404).json({ message: 'Chamado não encontrado' });
            }
            await chamado.destroy();
            res.status(200).json({ message: 'Chamado excluido com sucesso' });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao deletar chamado' })
        }
    }

}

export default ChamadoController;