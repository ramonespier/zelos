import Equipamento from '../entities/Equipamento.js';

class EquipamentoController {

    static async listar(req, res) {
        try {
            const equipamentos = await Equipamento.findAll();
            res.json(equipamentos);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar equipamentos' });
        }
    }

    // buscar equipamento por patrimônio
    static async buscarPorPatrimonio(req, res) {
        try {
            const { patrimonio } = req.params;
            const equipamento = await Equipamento.findByPk(patrimonio);
            if (!equipamento) {
                return res.status(404).json({ message: 'Equipamento não encontrado' });
            }
            res.json(equipamento);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar equipamento' });
        }
    }

    static async criar(req, res) {
        try {
            const { patrimonio, sala, equipamento } = req.body;

            // validação básica
            if (!patrimonio || !equipamento) {
                return res.status(400).json({ message: 'Campos obrigatórios faltando: patrimonio e equipamento' });
            }

            // verifica se já existe
            const existente = await Equipamento.findByPk(patrimonio);
            if (existente) {
                return res.status(400).json({ message: 'Equipamento com esse patrimônio já existe' });
            }

            const novoEquipamento = await Equipamento.create({ patrimonio, sala, equipamento });
            res.status(201).json(novoEquipamento);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao criar equipamento' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { patrimonio } = req.params;
            const { sala, equipamento } = req.body;

            const equip = await Equipamento.findByPk(patrimonio);
            if (!equip) {
                return res.status(404).json({ message: 'Equipamento não encontrado' });
            }

            // atualiza somente os campos enviados
            if (sala !== undefined) equip.sala = sala;
            if (equipamento !== undefined) equip.equipamento = equipamento;

            await equip.save();
            res.status(200).json(equip);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao atualizar equipamento' });
        }
    }

    static async deletar(req, res) {
        try {
            const { patrimonio } = req.params;

            const equip = await Equipamento.findByPk(patrimonio);
            if (!equip) {
                return res.status(404).json({ message: 'Equipamento não encontrado' });
            }

            await equip.destroy();
            res.status(200).json({ message: 'Equipamento deletado com sucesso' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao deletar equipamento' });
        }
    }
}

export default EquipamentoController;
