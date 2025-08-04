import { JWT_SECRET } from '../configs/jwt.js';
import jwt from 'jsonwebtoken';

class AuthMiddleware {

    verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Não autorizado: Token não fornecido' })
        }

        const [, token] = authHeader.split(' ');

        try{
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err){
            return res.status(401).json({message: 'Token inválido ou expirado'});
        }
    }
}

export default new AuthMiddleware();