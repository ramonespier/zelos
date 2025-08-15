import Pool from '../entities/Pool.js'

class PoolController {

    // listando pools
    static async listar(req, res) {
        try {
            const pools = await Pool.findAll();
            res.json(pools);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar pools' });
        }
    }

    // buscar pool por id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const pool = await Pool.findByPk(id);

            if (!pool) {
                return res.status(404).json({ message: 'Pool não encontrada' });
            }

            res.json(pool);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar pool' });
        }
    }

    
    // criar pool
    static async criar(req, res) {
        try {
            const { titulo, descricao, usuario_id, created_by, updated_by} = req.body;
            const novoPool = await Pool.create({ titulo, descricao, usuario_id, created_by, updated_by });
            res.status(201).json(novoPool);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar pool' });
        }
    }

    // deletar pool
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const pool = await Pool.findByPk(id);

            if (!pool) {
                return res.status(404).json({ message: 'Pool não encontrada' });
            }

            await pool.destroy();
            res.json({ message: 'Pool deletada com sucesso' });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao deletar pool' });
        }
    }

}

export default PoolController;