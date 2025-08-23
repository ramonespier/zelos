import Mensagem from "../entities/Mensagem.js";
import Usuario from "../entities/Usuario.js";
import { Sequelize } from "sequelize";


export const getMinhasMensagens = async (req, res) => {
    try {
        const usuarioId = req.user.id; 

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


export const sendMensagem = async (req, res) => {
    try {
        const remetente = req.user;
        const { conteudo, conversaUsuarioId } = req.body; 

        let data;

        // se for admin ou técnico respondendo...
        if (['admin', 'tecnico'].includes(remetente.funcao)) {
            if (!conversaUsuarioId) {
                return res.status(400).json({ error: "É necessário especificar o ID do usuário da conversa." });
            }
            data = {
                conteudo,
                usuario_id: conversaUsuarioId, 
                admin_id: remetente.id,        
            };
        } else {
      
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


export const getConversasAdmin = async (req, res) => {
    
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
                required: true 
            }]
        });
        res.status(200).json(conversas);
    } catch (error) {
      
        console.error("Erro detalhado ao buscar conversas:", error);
        res.status(500).json({ error: "Erro interno ao buscar conversas." });
    }
};

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