import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/jwt.js';
import bcrypt from 'bcryptjs';
import Usuario from '../entities/Usuario.js';

class AuthController {

    constructor() {
        this.login = this.login.bind(this);
    }
    
    gerarToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    }

    async login(req, res) {

        const { username, password } = req.body;
        try {
            const usuario = await Usuario.findOne({ where: { username } });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const senhaCorreta = await bcrypt.compare(password, usuario.password);

            if (!senhaCorreta) {
                return res.status(401).json({ message: 'Senha incorreta' });
            }

            const token = this.gerarToken({
                username: usuario.username,
                displayName: usuario.displayName,
                email: usuario.email
            });


            return res.status(200).json({ message: 'Login efetuado com sucesso!!!', token });

        } catch (err) {
            res.status(500).json({ message: 'Erro ao efetuar login' });
            console.error(err);
        }

    }

}

export default new AuthController();