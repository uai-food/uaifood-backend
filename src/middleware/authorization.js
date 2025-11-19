const prisma = require('../../prisma/prismaClient');
const jwtConfig = require('../../auth/jwtConfigs');

// Middleware que permite acesso somente para usuários com certos papéis
// Exemplo: requireRole('ADMIN') => só permite admins
function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const userPayload = req.user; // pega o payload do JWT que foi preenchido pelo middleware de autenticação
      if (!userPayload || !userPayload.id) return res.sendStatus(401); // se não houver usuário autenticado, retorna 401

  const userId = userPayload.id;
  // busca o usuário no banco de dados pelo ID
  // usar Number para manter consistência com outros controllers que usam Number(...)
  const dbUser = await prisma.user.findUnique({ where: { id: Number(userId) } });
      if (!dbUser) return res.sendStatus(401); // se usuário não existir no banco, retorna 401

      // verifica se o tipo do usuário está entre os permitidos
      if (!allowedRoles.includes(dbUser.type)) 
        return res.status(403).json({ error: 'Acesso negado.' }); // se não estiver, retorna 403 (proibido)

      // coloca o usuário do banco na requisição para uso posterior em outras rotas
      req.currentUser = dbUser;

      next(); // permite que a requisição continue
    } catch (err) {
      console.error(err);
      return res.sendStatus(500); // erro interno do servidor
    }
  };
}

// Middleware que permite acesso se o usuário for a pessoa autenticada ou tiver certos papéis
// Exemplo: requireSelfOrRole('ADMIN') => permite se for o próprio usuário ou um admin
function requireSelfOrRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const userPayload = req.user; // pega o payload do JWT
      if (!userPayload || !userPayload.id) return res.sendStatus(401); // se não estiver autenticado, retorna 401

  const userId = userPayload.id;
  // busca o usuário no banco de dados pelo ID
  const dbUser = await prisma.user.findUnique({ where: { id: Number(userId) } });
      if (!dbUser) return res.sendStatus(401); // se não encontrar, retorna 401

      // verifica se o usuário está tentando acessar seus próprios dados
      if (req.params && req.params.id && req.params.id.toString() === userId.toString()) {
        req.currentUser = dbUser; // permite o acesso
        return next();
      }

      // caso não seja o próprio usuário, verifica se possui papel permitido
      if (!allowedRoles.includes(dbUser.type)) 
        return res.status(403).json({ error: 'Acesso negado.' }); // se não tiver, retorna 403

      // se tiver papel permitido, adiciona o usuário à requisição
      req.currentUser = dbUser;

      next(); // permite que a requisição continue
    } catch (err) {
      console.error(err);
      return res.sendStatus(500); // erro interno do servidor
    }
  };
}

// Middleware para autenticar o token JWT e popular `req.user`
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ error: 'Token ausente' });
  try {
    const payload = await jwtConfig.verifyToken(token);
    const id = payload && payload.id ? Number(payload.id) : undefined;
    req.user = { ...payload, id };
    return next();
  } catch (error) {
    console.error('JWT verify error:', error && error.message ? error.message : error);
    return res.status(403).json({ error: (error && error.message) || 'Token inválido' });
  }
}

module.exports = { requireRole, requireSelfOrRole, authenticateToken };
