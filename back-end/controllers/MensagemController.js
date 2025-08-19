import Mensagem from "../entities/Mensagem.js";
import Usuario from "../entities/Usuario.js";
import { Sequelize } from "sequelize";

// ROTA: GET /mensagens/minhas
// Para um USUÁRIO COMUM buscar sua própria conversa
export const getMinhasMensagens = async (req, res) => {
    try {
        const usuarioId = req.user.id; // ID vem do token JWT

        const mensagens = await Mensagem.findAll({
            where: { usuario_id: usuarioId },
            include: [
                { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
                { model: Usuario, as: "admin", attributes: ["id", "nome", "funcao"] }
            ],
            order: [["criado_em", "ASC"]]
        });
        res.status(200).json(mensagens);
    } catch (error) {
        console.error("Erro ao buscar mensagens do usuário:", error);
        res.status(500).json({ error: "Erro interno ao buscar mensagens." });
    }
};

// ROTA: POST /mensagens
// Para QUALQUER UM (usuário, admin ou técnico) enviar uma mensagem
export const sendMensagem = async (req, res) => {
    try {
        const remetente = req.user;
        const { conteudo, conversaUsuarioId } = req.body; // 'conversaUsuarioId' é para admins/técnicos responderem

        let data;

        // Se for admin ou técnico respondendo...
        if (['admin', 'tecnico'].includes(remetente.funcao)) {
            if (!conversaUsuarioId) {
                return res.status(400).json({ error: "É necessário especificar o ID do usuário da conversa." });
            }
            data = {
                conteudo,
                usuario_id: conversaUsuarioId, // O "dono" da conversa
                admin_id: remetente.id,        // O admin/técnico que está respondendo
            };
        } else {
            // Se for um usuário comum...
            data = {
                conteudo,
                usuario_id: remetente.id,
                admin_id: null,
            };
        }

        const novaMensagem = await Mensagem.create(data);
        const mensagemCriada = await Mensagem.findByPk(novaMensagem.id, {
            include: [
                { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
                { model: Usuario, as: "admin", attributes: ["id", "nome", "funcao"] }
            ]
        });

        res.status(201).json(mensagemCriada);

    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        res.status(500).json({ error: "Erro interno ao enviar mensagem." });
    }
};

// ===============================================
// === Funções Exclusivas para Admin/Técnicos ====
// ===============================================

// ROTA: GET /mensagens/conversas
// Para admin/técnico ver a lista de todas as conversas
export const getConversasAdmin = async (req, res) => {
    // A verificação de permissão continua a mesma
    if (!['admin', 'tecnico'].includes(req.user.funcao)) {
        return res.status(403).json({ error: "Acesso negado." });
    }
    try {
        const conversas = await Mensagem.findAll({
            attributes: [
                'usuario_id',
                [Sequelize.fn('MAX', Sequelize.col('Mensagem.conteudo')), 'ultima_mensagem'],
                [Sequelize.fn('MAX', Sequelize.col('Mensagem.criado_em')), 'data_ultima_mensagem']
            ],
            // AQUI ESTÁ A CORREÇÃO:
            // Adicionamos as colunas do modelo 'Usuario' que estamos selecionando no group by.
            // O alias 'usuario' deve ser usado para referenciar a tabela associada.
            group: [
                'usuario_id',
                'usuario.id',
                'usuario.nome'
            ],
            order: [[Sequelize.fn('MAX', Sequelize.col('Mensagem.criado_em')), 'DESC']],
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['id', 'nome'],
                required: true // Garante que apenas usuários com mensagens apareçam
            }]
        });
        res.status(200).json(conversas);
    } catch (error) {
        // Este log agora deve mostrar o erro real no seu terminal se algo ainda der errado
        console.error("Erro detalhado ao buscar conversas:", error);
        res.status(500).json({ error: "Erro interno ao buscar conversas." });
    }
};
// ROTA: GET /mensagens/usuario/:usuarioId
// Para admin/técnico buscar mensagens de um usuário específico
export const getMensagensPorUsuarioAdmin = async (req, res) => {
    if (!['admin', 'tecnico'].includes(req.user.funcao)) {
        return res.status(403).json({ error: "Acesso negado." });
    }
    try {
        const { usuarioId } = req.params;
        const mensagens = await Mensagem.findAll({
            where: { usuario_id: usuarioId },
            include: [
                { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
                { model: Usuario, as: "admin", attributes: ["id", "nome", "funcao"] }
            ],
            order: [["criado_em", "ASC"]]
        });
        res.status(200).json(mensagens);
    } catch (error) {
        console.error("Erro ao buscar mensagens do usuário (admin):", error);
        res.status(500).json({ error: "Erro interno ao buscar mensagens." });
    }
}; 