import dotenv from 'dotenv';
import express from 'express';
import sequelize from './configs/database.js';
import passport from './configs/ldap.js';
import cors from 'cors';
import session from 'express-session';
// routes
import usuarioRoutes from './routes/usuarioRoutes.js';
import poolRoutes from './routes/poolRoutes.js';
import poolTecnicoRoutes from './routes/poolTecnicoRoutes.js';
import chamadoRoutes from './routes/chamadoRoutes.js';
import apontamentoRoutes from './routes/apontamentoRoutes.js';
import avaliacaoRoutes from './routes/avaliacaoRoutes.js'
import relatorioRoutes from './routes/relatorioRoutes.js'
import authRoutes from './routes/authRoutes.js'

const app = express();
const PORT = process.env.PORT || 3000;

// .env
dotenv.config();
// middleware
app.use(express.json());

try {
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));
    app.use(express.json());
    
    app.use(session({
      secret: 'sJYMmuCB2Z187XneUuaOVYTVUlxEOb2K94tFZy370HjOY7T7aiCKvwhNQpQBYL9e',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    }));
  
    // 4. Inicialização segura do Passport
    if (!passport) {
      throw new Error('Passport não foi importado corretamente');
    }
    app.use(passport.initialize());
    app.use(passport.session());
  
  } catch (err) {
    console.error('Erro na configuração inicial:', err);
    process.exit(1);
  }

// rota inicial
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Página inicial' })
})

app.use('/usuarios', usuarioRoutes);
app.use('/pools', poolRoutes);
app.use('/pools-tecnico', poolTecnicoRoutes);
app.use('/chamados', chamadoRoutes);
app.use('/apontamento', apontamentoRoutes);
app.use('/avaliacoes', avaliacaoRoutes);
app.use('/relatorios', relatorioRoutes);
app.use('/auth', authRoutes);

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
