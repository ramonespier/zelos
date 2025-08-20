import { Op } from 'sequelize'; // <<<<<<< IMPORTANTE: Adicione esta importação
import Chamado from '../entities/Chamado.js';
import Usuario from '../entities/Usuario.js';
import Equipamento from '../entities/Equipamento.js';
import Pool from '../entities/Pool.js'; // Adicione a importação do modelo Pool

class ChamadoController {

    // Lista de chamados para o painel de gerenciamento (AGORA FILTRADA)
    static async listar(req, res) {
        try {
            // Este filtro garante que a lista de gerenciamento mostre
            // apenas chamados abertos por 'usuarios' ou 'admins'.
            const whereClause = {
                '$usuario.funcao$': {
                    [Op.ne]: 'tecnico' // Onde a função do criador NÃO É ('ne') técnico
                }
            };

            const chamados = await Chamado.findAll({
                include: [
                    {
                        model: Usuario,
                        as: 'usuario', // Associa o modelo do criador para o filtro
                        attributes: [] // Não precisamos dos dados do criador no resultado final
                    },
                    {
                        model: Usuario,
                        as: 'tecnico' // Inclui dados do técnico atribuído
                    },
                    {
                        model: Pool, // Inclui dados da pool
                        as: 'pool'
                    }
                ],
                where: whereClause
            });

            res.json(chamados);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar chamados' });
        }
    }

    //
    // --- O RESTANTE DOS MÉTODOS PERMANECE EXATAMENTE O MESMO ---
    //

    // buscar por id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const chamado = await Chamado.findByPk(id, {
                include: [
                    { association: 'tecnico', required: false },
                    { association: 'pool' }
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

    // Atualização genérica do chamado


    // Criar um novo chamado
    static async criar(req, res) {
        try {
            const { titulo, numero_patrimonio, descricao, pool_id } = req.body;
            if (!numero_patrimonio || !pool_id || !titulo || !descricao) {
                return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
            }
            const equipamento = await Equipamento.findByPk(numero_patrimonio);
            if (!equipamento) {
                return res.status(404).json({ message: `Equipamento com o patrimônio "${numero_patrimonio}" não foi encontrado.` });
            }
            const chamadoExistente = await Chamado.findOne({
                where: {
                    numero_patrimonio,
                    status: ['aberto', 'em andamento'] // Evita chamado duplicado que não seja 'concluido' ou 'cancelado'
                }
            });
            if (chamadoExistente) {
                return res.status(400).json({ message: 'Já existe um chamado ativo para este número de patrimônio' });
            }
            const chamado = await Chamado.create({
                titulo,
                numero_patrimonio,
                descricao,
                usuario_id: req.user.id,
                pool_id
            });
            res.status(201).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ocorreu um erro interno ao criar o chamado' });
        }
    }

    // Atribuir / Desatribuir um chamado
    // ATRIBUIR / DESATRIBUIR um chamado (com validação de função)
    static async atribuir(req, res) {
        try {
            const { id } = req.params;
            const { tecnico_id } = req.body;

            const chamado = await Chamado.findByPk(id);
            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }

            // Se um tecnico_id for fornecido (não é null)
            if (tecnico_id) {
                const tecnico = await Usuario.findByPk(tecnico_id);
                // ===== A VALIDAÇÃO CRUCIAL ESTÁ AQUI =====
                if (!tecnico || tecnico.funcao !== 'tecnico') {
                    return res.status(400).json({ message: 'Atribuição falhou: o usuário selecionado não é um técnico.' });
                }
            }

            await chamado.update({ tecnico_id: tecnico_id });
            await chamado.reload({ include: ['tecnico'] });

            res.status(200).json(chamado);
        } catch (err) {
            console.error("Erro ao atribuir chamado:", err);
            res.status(500).json({ message: "Erro ao atualizar chamado" });
        }
    }

    // ATUALIZAR chamado (com validação de função no técnico)
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { titulo, tecnico_id, status } = req.body;

            const chamado = await Chamado.findByPk(id);
            if (!chamado) {
                return res.status(404).json({ message: 'Chamado não encontrado' });
            }

            // A mesma validação precisa estar aqui
            if (tecnico_id) {
                const tecnico = await Usuario.findByPk(tecnico_id);
                if (!tecnico || tecnico.funcao !== 'tecnico') {
                    return res.status(400).json({ message: 'Atribuição falhou: o usuário selecionado não é um técnico.' });
                }
            }

            // Só atualiza os campos se eles existirem no body da requisição
            // O `undefined` no `else` garante que o campo não seja alterado se não for passado
            chamado.titulo = titulo !== undefined ? titulo : chamado.titulo;
            chamado.tecnico_id = tecnico_id !== undefined ? tecnico_id : chamado.tecnico_id;
            chamado.status = status !== undefined ? status : chamado.status;

            await chamado.save();
            await chamado.reload({ include: ['tecnico'] });

            res.status(200).json(chamado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao atualizar chamado" });
        }
    }

    // Atualizar o status do chamado 
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

    // Fechar chamado
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
}

export default ChamadoController;