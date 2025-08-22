import express from 'express';
import passport from '../configs/ldap.js';
import AuthController from '../controllers/AuthController.js';
import Usuario from '../entities/Usuario.js';

const router = express.Router();

router.post('/login', (req, res, next) => {

  const { username, password } = req.body;

  // Defina aqui as credenciais do seu usuário fixo
  const DEV_USER = 'devuser';
  const DEV_PASSWORD = 'password';

  // Verificamos se as credenciais correspondem ao nosso usuário de desenvolvimento
  if (username === DEV_USER && password === DEV_PASSWORD) {
    console.log('>>> ATIVANDO MODO DE LOGIN DE DESENVOLVEDOR <<<');

    // 1. Crie um objeto de usuário falso (mock).
    // Ele deve ter a mesma estrutura que um usuário real do seu banco de dados.
    const mockUsuario = {
      id: '00000000-0000-0000-0000-000000000001', // Um UUID de exemplo
      username: DEV_USER,
      nome: 'Usuário Desenvolvedor',
      email: 'dev@local.com',
      funcao: 'admin', // Dê a ele admin de admin para facilitar os testes
    };
    

    // 2. Gere o token para este usuário falso.
    const token = AuthController.gerarToken(mockUsuario);

    // 3. Envie a resposta de sucesso, exatamente como no fluxo normal.
    return res.json({
      message: 'Autenticado com sucesso (MODO DEV)',
      user: {
        ...mockUsuario, // Inclui todos os campos do mock
        token
      }
    });
  }


  passport.authenticate('ldapauth', { session: true }, async (err, user, info) => {
    try {
      if (err) {
        console.error('Erro na autenticação:', err);
        return res.status(500).json({ error: 'Erro interno no servidor' });
      }

      if (!user) {
        console.warn('Falha na autenticação:', info?.message || 'Credenciais inválidas');
        return res.status(401).json({ error: info?.message || 'Autenticação falhou' });
      }

      console.log('LDAP retornou:', user);

      // aqui estou fazendo com que 3 users tenha o padrao de acesso do sistema
      let funcao = 'usuario';

      if (user.sAMAccountName === '24250492') funcao = 'tecnico';
      if (user.sAMAccountName === '24250469') funcao = 'admin';
      if (user.sAMAccountName === '24250246') funcao = 'tecnico';
      // xqMeBX
      if (user.sAMAccountName === '00000000') funcao = 'tecnico';

      // aqui estou bucando e se não estiver cadastrado no meu banco eu crio
      let usuario = await Usuario.findOne({
        where: { username: user.sAMAccountName },
        attributes: { exclude: ['senha', 'password'] }
      });

      if (!usuario) {
        usuario = await Usuario.create({
          username: user.sAMAccountName,
          nome: user.displayName,
          email: user.userPrincipalName,
          funcao: funcao
        });
      } else {
        if (usuario.funcao !== funcao) {
          usuario.funcao = funcao;
          await usuario.save();
        }
      }

      // Loga o usuário manualmente para garantir a sessão
      req.logIn(usuario, (loginErr) => {
        if (loginErr) {
          console.error('Erro ao criar sessão:', loginErr);
          return res.status(500).json({ error: 'Erro ao criar sessão' });
        }

        const token = AuthController.gerarToken({
          id: usuario.id,
          username: usuario.username,
          nome: usuario.nome,
          email: usuario.email,
          funcao: usuario.funcao
        });

        console.log('Usuário autenticado:', user.displayName);
        return res.json({
          message: 'Autenticado com sucesso',
          user: {
            id: usuario.id,
            username: usuario.username,
            nome: usuario.nome,
            email: usuario.email,
            funcao: usuario.funcao,
            token
          }
        });
      });

    } catch (error) {
      console.error('Erro inesperado:', error);
      res.status(500).json({ error: 'Erro inesperado no servidor' });
    }
  })(req, res, next);
});

// Rota de Logout (mantida igual)
router.post('/logout', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Nenhum usuário autenticado' });
  }

  console.log('Usuário deslogando:', req.user?.username);

  req.logout((err) => {
    if (err) {
      console.error('Erro no logout:', err);
      return res.status(500).json({ error: 'Erro ao realizar logout' });
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Erro ao destruir sessão:', destroyErr);
        return res.status(500).json({ error: 'Erro ao encerrar sessão' });
      }

      res.clearCookie('connect.sid');
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });
});

// Rota para verificar autenticação (mantida igual)
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  }
  res.status(401).json({ authenticated: false });
});

export default router;