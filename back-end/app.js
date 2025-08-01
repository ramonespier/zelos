import dotenv from 'dotenv';
import express from 'express';
import sequelize from './configs/database.js';

// routes
import usuarioRoutes from './routes/usuarioRoutes.js'
import poolRoutes from './routes/poolRoutes.js'
import poolTecnicoRoutes from './routes/poolTecnicoRoutes.js'
import chamadoRoutes from './routes/chamadoRoutes.js'
import apontamentoRoutes from './routes/apontamentoRoutes.js'

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
app.use('/pools', poolRoutes);
app.use('/pools-tecnico', poolTecnicoRoutes);
app.use('/chamados', chamadoRoutes);
app.use('/apontamento', apontamentoRoutes);

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
