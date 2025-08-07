import Chamado from '../entities/Chamado.js'
import Usuario from '../entities/Usuario.js';

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
            // futuramente colocar o user
            const { titulo, numero_patrimonio, descricao, pool_id, tipo_id, status } = req.body;

            // Verifica se já existe chamado com mesmo número de patrimônio, tipo e status aberto
            const chamadoExistente = await Chamado.findOne({
                where: {
                    numero_patrimonio,
                    tipo_id,
                    status: 'aberto'
                }
            });

            if (chamadoExistente) {
                return res.status(400).json({ message: 'Já existe um chamado aberto para este número de patrimônio e tipo' });
            }
            const chamado = await Chamado.create({
                titulo,
                numero_patrimonio,
                descricao,
                pool_id,
                status
            })


            res.status(201).json(chamado);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar chamado' });
            console.error(err);
        }
    }

    static async atribuir(req, res) {
        try {
            const { id } = req.params;
            const { tecnico_id } = req.body;
            const chamado = await Chamado.findByPk(id);

            // verifica se chamado existe
            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }

            // verifica se ja esta atribuido a algum tecnico
            if (chamado.tecnico_id) {
                return res.status(400).json({ message: 'Chamado já está atribuído a um técnico' });
            }

            // verifica se tecnico existe
            const tecnico = await Usuario.findByPk(id);
            if (!tecnico) {
                return res.status(404).json({ message: 'Técnico não encontrado' });
            }

            await chamado.update({ tecnico_id });
            res.status(200).json(chamado);
        } catch (err) {
            res.status(500).json({ message: "Erro ao atualiar chamado" })
        }
    }

    static async fechar(req, res) {
        try {
            const { id } = req.params;
            const chamado = await Chamado.findByPk(id);
            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }
            await chamado.update({ status: 'concluido' });
            res.status(200).json(chamado);
        } catch (err) {
            res.status(500).json({ message: "Erro ao atualiar chamado" })
        }
    }


}

export default ChamadoController;