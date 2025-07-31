import PoolTecnico from '../entities/PoolTecnico.js'

class PoolTecnicoController {

    static async listar(req, res) {
        try {
            const poolTecnico = await PoolTecnico.findAll();
            res.json(poolTecnico);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar pools de tecnicos' });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const poolTecnico = await PoolTecnico.findByPk(id);
            if (!poolTecnico) {
                return res.status(404).json({ message: 'Pool de tecnico não encontrada' })  
            };
            res.json(poolTecnico);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar pool de tecnico' });
        }
    }

    static async criar(req, res) {
        try {
            const { id_tecnico, id_pool } = req.body;
            const poolTecnico = await PoolTecnico.create({
                id_tecnico,
                id_pool
            })
            res.status(201).json(poolTecnico);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar pool de técnico' })
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { id_tecnico, id_pool } = req.body;
            const poolTecnico = await PoolTecnico.findByPk(id);
            if (!poolTecnico) {
                return res.status(404).json({ message: 'Pool de tecnico não encontrada' });
            }
            await poolTecnico.update({ id_tecnico, id_pool });
            res.json(poolTecnico);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao atualizar pool de técnico' });
        }
    }

    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const poolTecnico = await PoolTecnico.findByPk(id);
            if (!poolTecnico) {
                return res.status(404).json({ message: 'Pool de técnico não encontrada' });
            }
            await poolTecnico.destroy();
            res.json({ message: 'Pool de técnico deletada com sucesso' })
        } catch (err) {
            res.status(500).json({ message: 'Erro ao deletar pool de tecnico' })
        }
    }


}

export default PoolTecnicoController;