
class Autorizar {
    autorizacao(usuario, perfisPermitidos){
        return (req, res, next) => {

            if(!usuario){
                return res.status(401).json({message: 'Usuário não autenticado'});
            }

            if(!perfisPermitidos.includes(usuario.funcao)){
                return res.status(403).json({message: 'Acesso negado para seu perfil'});
            }

            next();
        }
    }
}

export default Autorizar;