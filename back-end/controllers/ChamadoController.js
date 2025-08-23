import { Op } from 'sequelize';
import Chamado from '../entities/Chamado.js';
import Usuario from '../entities/Usuario.js';
import Equipamento from '../entities/Equipamento.js';
import Apontamento from '../entities/Apontamento.js';
import Pool from '../entities/Pool.js';

class ChamadoController {

    static async listar(req, res) {
        try {
            const whereClause = {
                '$usuario.funcao$': { [Op.ne]: 'tecnico' }
            };
            const chamados = await Chamado.findAll({
                include: [
                    { model: Usuario, as: 'usuario', attributes: [] },
                    { model: Usuario, as: 'tecnico' },
                    { model: Pool, as: 'pool' }
                ],
                where: whereClause,
                order: [['criado_em', 'DESC']] // ordena pelos mais recentes
            });
            res.json(chamados);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar chamados' });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const chamado = await Chamado.findByPk(id, {
                include: [
                    { association: 'tecnico', required: false },
                    { association: 'pool' },
                    { association: 'usuario' }
                ]
            });
            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }
            res.json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar chamado' });
        }
    }

    static async criar(req, res) {
        try {
            const { titulo, numero_patrimonio, descricao, pool_id } = req.body;

            const img_url = req.file ? `/uploads/${req.file.filename}` : null;

            // validação dos campos que são sempre obrigatórios
            if (!titulo || !descricao || !pool_id) {
                return res.status(400).json({ message: 'Campos obrigatórios faltando: Título, Descrição e Tipo de Solicitação.' });
            }


            // só executa as validações de patrimônio se ele for fornecido
            if (numero_patrimonio && numero_patrimonio.trim() !== '') {

                // verifica se o equipamento existe
                const equipamento = await Equipamento.findByPk(numero_patrimonio);
                if (!equipamento) {
                    return res.status(404).json({ message: `Equipamento com o patrimônio "${numero_patrimonio}" não foi encontrado. Verifique o número ou deixe o campo em branco.` });
                }

                // verifica se já existe um chamado ativo para este equipamento
                const chamadoExistente = await Chamado.findOne({
                    where: {
                        numero_patrimonio: numero_patrimonio,
                        status: ['aberto', 'em andamento']
                    }
                });
                if (chamadoExistente) {
                    return res.status(400).json({ message: 'Já existe um chamado ativo para este equipamento.' });
                }
            }

            // se numero_patrimonio for vazio salva como null
            const chamado = await Chamado.create({
                titulo,
                numero_patrimonio: numero_patrimonio || null,
                descricao,
                pool_id,
                img_url,
                usuario_id: req.user.id,
            });

            res.status(201).json(chamado);

        } catch (err) {
            console.error("Erro no controller ao criar chamado:", err);
            res.status(500).json({ message: 'Ocorreu um erro interno ao processar sua solicitação.' });
        }
    }

    static async atribuir(req, res) {
        try {
            const { id } = req.params;
            const { tecnico_id } = req.body;

            const chamado = await Chamado.findByPk(id);
            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }
            if (chamado.status === 'concluido' || chamado.status === 'cancelado') {
                return res.status(400).json({ message: 'Não é possível atribuir um chamado que já foi concluído ou cancelado.' });
            }

            // o objeto que será usado para a atualização
            let updateData = {
                tecnico_id: null,
                status: 'aberto' // se desatribuído, volta a ser 'aberto'
            };

            // se um tecnico_id válido foi fornecido...
            if (tecnico_id) {
                const tecnico = await Usuario.findByPk(tecnico_id);
                if (!tecnico || tecnico.funcao !== 'tecnico') {
                    return res.status(400).json({ message: 'Atribuição falhou: o usuário selecionado não é um técnico.' });
                }

                // preparamos para atribuir e mudar o status
                updateData.tecnico_id = tecnico_id;
                updateData.status = 'em andamento';
            }

            await chamado.update(updateData);
            await chamado.reload({ include: ['tecnico'] });
            res.status(200).json(chamado);
        } catch (err) {
            console.error("Erro ao atribuir chamado:", err);
            res.status(500).json({ message: "Erro ao atualizar chamado" });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            let { titulo, tecnico_id, status } = req.body;

            const chamado = await Chamado.findByPk(id);
            if (!chamado) { return res.status(404).json({ message: 'Chamado não encontrado' }); }

            if (tecnico_id && chamado.status === 'aberto') {
                status = 'em andamento';
            }

            if (tecnico_id === null && chamado.status === 'em andamento') {
                status = 'aberto';
            }

            if (tecnico_id !== undefined) {
                if (tecnico_id) {
                    const tecnico = await Usuario.findByPk(tecnico_id);
                    if (!tecnico || tecnico.funcao !== 'tecnico') {
                        return res.status(400).json({ message: 'Atribuição falhou: usuário não é técnico.' });
                    }
                }
                chamado.tecnico_id = tecnico_id;
            }

            if (titulo !== undefined) chamado.titulo = titulo;
            if (status !== undefined) chamado.status = status;

            await chamado.save();
            await chamado.reload({ include: ['tecnico'] });
            res.status(200).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao atualizar chamado" });
        }
    }

    static async status(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const chamado = await Chamado.findByPk(id);
            if (!chamado) return res.status(404).json({ message: 'Chamado não encontrado' });
            await chamado.update({ status });
            await chamado.reload();
            res.status(200).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao atualizar status do chamado" });
        }
    }

    static async fechar(req, res) {
        try {
            const { id } = req.params;
            const chamado = await Chamado.findByPk(id);
            if (!chamado) return res.status(404).json({ message: 'Chamado não encontrado' });
            if (chamado.status !== 'em andamento') return res.status(400).json({ message: 'Apenas chamados em andamento podem ser fechados.' });
            await chamado.update({ status: 'concluido' });
            await chamado.reload();
            res.status(200).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao fechar chamado" });
        }
    }

    static async listarApontamentos(req, res) {
        try {
            const { id } = req.params;

            const chamado = await Chamado.findByPk(id);
            if (!chamado) {
                return res.status(404).json({ message: "Chamado não encontrado." });
            }

            const apontamentos = await Apontamento.findAll({
                where: { chamado_id: id },
                order: [['criado_em', 'DESC']]
            });

            res.json(apontamentos);
        } catch (err) {
            console.error("Erro ao buscar apontamentos:", err);
            res.status(500).json({ message: 'Erro ao buscar apontamentos.' });
        }
    }

    static async listarHistoricoTecnico(req, res) {
        try {
            const tecnico_id = req.user.id;

            const chamados = await Chamado.findAll({
                where: {
                    tecnico_id: tecnico_id,
                    status: ['concluido', 'cancelado']
                },
                include: ['usuario', 'pool'],
                order: [['atualizado_em', 'DESC']]
            });

            res.json(chamados);
        } catch (err) {
            console.error("Erro ao buscar histórico do técnico:", err);
            res.status(500).json({ message: 'Erro ao buscar histórico de chamados.' });
        }
    }
}

export default ChamadoController;   