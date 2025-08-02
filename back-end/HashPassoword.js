import bcrypt from "bcryptjs";

class HashPassoword {

        async HashPassoword(senha){

            try {
                //gerar salt 
                const salt = await bcrypt.genSalt(10);
                const hashedPassoword = await bcrypt.hash(senha, salt)
                console.log('Senha hasheada: ', hashedPassoword);
                return hashedPassoword;
            } catch (err) {
                console.error("Erro ao hashear a senha: ", err);
                process.exit(1);
            }
        }
    }

export default new HashPassoword();