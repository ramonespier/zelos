import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/jwt.js';
import Usuario from '../entities/Usuario.js';

class AuthController {
    
    gerarToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    }

    // este método não será mais usado 
    async login(req, res) {
        return res.status(400).json({ 
            message: 'Método não suportado. Use a autenticação LDAP diretamente.' 
        });
    }

    // gerar token
    gerarTokenParaUsuarioLDAP(usuario) {
        return this.gerarToken({
            id: usuario.id,
            username: usuario.username,
            nome: usuario.nome,
            email: usuario.email,
            funcao: usuario.funcao
        });
    }
}

export default new AuthController();