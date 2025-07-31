import dotenv from 'dotenv';
import express from 'express';

// models   
import Usuario from './entities/Usuario.js';
import Pool from './entities/Pool.js';
import PoolTecnico from './entities/PoolTecnico.js';
import Apontamento from './entities/Apontamento.js';
import Avaliacao from './entities/Avaliacao.js';
import Chamado from './entities/Chamado.js';
import sequelize from './configs/database.js';

// routes
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express();
const PORT = process.env.PORT || 3000;

// .env
dotenv.config();
// middleware
app.use(express.json());

// rota inicial
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Página inicial' })
})

app.use('/usuarios', usuarioRoutes);

async function StartServer() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o database feita com sucesso!!!');

        // server
        app.listen(PORT, () => {
            console.log('Servidor sendo executado em: localhost:3000');
        })

    } catch (err) {
        console.error('Erro ao conectar banco de dados: ', err)
    }
}

StartServer();
