const express = require('express');
const router = express.Router();

const { 
  createUser, 
  listUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  loginUser,
  autenticarToken
} = require('../controller/user');

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
 *                 description: Tipo do usuário (por exemplo, CLIENT ou ADMIN)
 *                 example: "ADMIN"
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
router.post('/', createUser);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Users]
 *     description: Retorna a lista de todos os usuários cadastrados.
 *     responses:
 *       200:
 *         description: Lista de usuários recuperada com sucesso.
 */
router.get('/', listUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obter usuário por ID
 *     tags: [Users]
 *     description: Retorna detalhes de um usuário específico.
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
 *       404:
 *         description: Usuário não encontrado.
 */
router.get('/:id', autenticarToken, getUserById);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualizar um usuário
 *     tags: [Users]
 *     description: Atualiza os dados de um usuário existente.
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Erro ao atualizar usuário.
 */
router.put('/:id', updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Remover um usuário
 *     tags: [Users]
 *     description: Remove um usuário do sistema pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
router.delete('/:id', deleteUser);

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
router.post('/login', loginUser);

module.exports = router;
