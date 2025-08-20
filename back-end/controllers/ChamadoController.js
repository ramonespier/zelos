import { Op } from 'sequelize';
import Chamado from '../entities/Chamado.js';
import Usuario from '../entities/Usuario.js';
import Equipamento from '../entities/Equipamento.js';
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
            
            // req.file vem do middleware 'multer'
            const img_url = req.file ? `/uploads/${req.file.filename}` : null;

            // validação de campos obrigatórios
            if (!titulo || !numero_patrimonio || !descricao || !pool_id) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios: Título, Patrimônio, Tipo e Descrição.' });
            }

            // validação se o equipamento existe
            const equipamento = await Equipamento.findByPk(numero_patrimonio);
            if (!equipamento) {
                return res.status(404).json({ message: `Equipamento com o patrimônio "${numero_patrimonio}" não foi encontrado. Verifique o número digitado.` });
            }
            
            // validação de chamado duplicado 
            const chamadoExistente = await Chamado.findOne({
                where: {
                    numero_patrimonio,
                    status: ['aberto', 'em andamento'] // evita chamado duplicado que não seja 'concluido' ou 'cancelado'
                }
            });
            if (chamadoExistente) {
                return res.status(400).json({ message: 'Já existe um chamado ativo (aberto ou em andamento) para este equipamento.' });
            }
            
            // 4. Criação do chamado no banco de dados
            const chamado = await Chamado.create({
                titulo,
                numero_patrimonio,
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
            if (!chamado) { return res.status(404).json({ message: 'Chamado não encontrado' }); }
            if (tecnico_id) {
                const tecnico = await Usuario.findByPk(tecnico_id);
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

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { titulo, tecnico_id, status } = req.body;
            const chamado = await Chamado.findByPk(id);
            if (!chamado) { return res.status(404).json({ message: 'Chamado não encontrado' }); }
            if (tecnico_id) {
                const tecnico = await Usuario.findByPk(tecnico_id);
                if (!tecnico || tecnico.funcao !== 'tecnico') {
                    return res.status(400).json({ message: 'Atribuição falhou: o usuário selecionado não é um técnico.' });
                }
            }
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
}

export default ChamadoController;