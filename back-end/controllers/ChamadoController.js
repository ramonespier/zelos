import crypto from 'crypto';
import Chamado from '../entities/Chamado.js';
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
                return res.status(404).json({ message: 'Chamado não encontrado' })
            }
            res.json(chamado);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar chamado' })
        }
    }

    static async criar(req, res) {
        try {
            const { titulo, numero_patrimonio, descricao, pool_id, status } = req.body;

            // campos
            if (!numero_patrimonio || !pool_id || !titulo || !descricao) {
                return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
            }

            // gerar hash do número de patrimônio para busca eficiente
            const hashNumeroPatrimonio = crypto
                .createHash('sha256')
                .update(numero_patrimonio)
                .digest('hex');

            // verifica se já existe chamado aberto com mesmo patrimônio e pool
            const chamadoExistente = await Chamado.findOne({
                where: {
                    hash_numero_patrimonio: hashNumeroPatrimonio,
                    pool_id,
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
            });

            res.status(201).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao criar chamado' });
        }
    }

    static async atribuir(req, res) {
        try {
            const { id } = req.params;
            const { tecnico_id, status } = req.body;
            const chamado = await Chamado.findByPk(id);

            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }

            if (chamado.tecnico_id) {
                return res.status(400).json({ message: 'Chamado já está atribuído a um técnico' });
            }

            const tecnico = await Usuario.findByPk(tecnico_id);
            if (!tecnico) {
                return res.status(404).json({ message: 'Técnico não encontrado' });
            }

            await chamado.update({ tecnico_id, status: 'em andamento' });
            res.status(200).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao atualizar chamado" });
        }
    }

    static async fechar(req, res) {
        try {
            const { id } = req.params;
            const chamado = await Chamado.findByPk(id);

            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }

            if (chamado.status !== 'em andamento') {
                return res.status(400).json({ message: 'Chamado não está em andamento' });
            }

            await chamado.update({ status: 'concluido' });
            res.status(200).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao atualizar chamado" });
        }
    }

}

export default ChamadoController;
