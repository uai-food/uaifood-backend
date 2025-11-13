const express = require('express');
const router = express.Router();

const { 
  createUser, 
  listUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  loginUser,
  autenticarToken,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controller/user');

const { requireSelfOrRole, requireRole } = require('../middleware/authorization');
const { createUserSchema, loginUserSchema, updateUserSchema, updateProfileSchema, changePasswordSchema, validate } = require('../zodValidation/user.schema');

// Rotas públicas

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [Users]
 *     description: Adiciona um novo usuário ao sistema com as informações fornecidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *                 example: "Stefani Joanne"
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: "stefani@teste.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "Maynn12345"
 *               phone:
 *                 type: string
 *                 description: Telefone do usuário
 *                 example: "1133333333"
 *               type:
 *                 type: string
 *                 description: Tipo do usuário (CLIENT ou ADMIN)
 *                 example: "CLIENT"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento no formato YYYY-MM-DD
 *                 example: "2000-01-15"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Falha ao criar usuário.
 */
router.post('/', validate(createUserSchema), createUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Users]
 *     description: Autentica um usuário e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: "stefani@teste.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "Maynn12345"
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Email ou senha inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/login', validate(loginUserSchema), loginUser);

// Rotas de perfil do usuário autenticado

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Retornar perfil do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso.
 *       401:
 *         description: Usuário não autenticado.
 *       404:
 *         description: Usuário não encontrado.
 */
router.get('/profile', autenticarToken, getProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Atualizar perfil do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: object
 *                 description: Campos do endereço (street, number, district, city, state, zipCode)
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso.
 *       400:
 *         description: Erro na atualização do perfil.
 */
router.put('/profile', autenticarToken, validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /user/profile/change-password:
 *   put:
 *     summary: Alterar senha do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso.
 *       400:
 *         description: Erro na alteração de senha.
 */
router.put('/profile/change-password', autenticarToken, validate(changePasswordSchema), changePassword);

// Rotas administrativas ou de usuário específico

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários recuperada com sucesso.
 *       403:
 *         description: Acesso não autorizado.
 */
router.get('/', autenticarToken, requireRole('ADMIN'), listUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obter usuário por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado.
 *       403:
 *         description: Acesso não autorizado.
 *       404:
 *         description: Usuário não encontrado.
 */
router.get('/:id', autenticarToken, requireSelfOrRole('ADMIN'), getUserById);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualizar usuário por ID (admin ou o próprio usuário)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Erro na atualização do usuário.
 *       403:
 *         description: Acesso não autorizado.
 */
router.put('/:id', autenticarToken, requireSelfOrRole('ADMIN'), validate(updateUserSchema), updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Deletar usuário por ID (admin ou o próprio usuário)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso.
 *       403:
 *         description: Acesso não autorizado.
 *       404:
 *         description: Usuário não encontrado.
 */
router.delete('/:id', autenticarToken, requireSelfOrRole('ADMIN'), deleteUser);

// Rotas de debug (opcional)
router.get('/debug/token', autenticarToken, async (req, res) => {
  try {
    const payload = req.user || null;
    let dbUser = null;
    if (payload && payload.id) {
      dbUser = await require('../prisma/prismaClient').user.findUnique({ where: { id: Number(payload.id) } });
    }
    return res.status(200).json({ payload, dbUser });
  } catch (err) {
    console.error('debug/token error', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Erro no debug token' });
  }
});

module.exports = router;
