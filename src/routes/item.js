const express = require('express');
const router = express.Router();
const itemController = require('../controller/item');

/**
 * @swagger
 * tags:
 *   name: Item
 *   description: Item operations
 */

/**
 * @swagger
 * /item:
 *   get:
 *     summary: Listar todos os itens
 *     tags: [Item]
 *     responses:
 *       200:
 *         description: Lista de itens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *   post:
 *     summary: Criar um novo item
 *     tags: [Item]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */

/**
 * @swagger
 * /item/{id}:
 *   get:
 *     summary: Obter item por ID
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item não encontrado
 *   put:
 *     summary: Atualizar item
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *   delete:
 *     summary: Delete item
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Item removido
 */

router.get('/', itemController.getAll);
router.post('/', itemController.create);
router.get('/:id', itemController.getById);
router.put('/:id', itemController.update);
router.delete('/:id', itemController.delete);

module.exports = router;
