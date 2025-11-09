const express = require('express');
const router = express.Router();
const orderItemController = require('../controller/orderItem');

/**
 * @swagger
 * tags:
 *   name: OrderItem
 *   description: OrderItem operations
 */

/**
 * @swagger
 * /orderItem:
 *   get:
 *     summary: Listar todos os itens de pedido
 *     tags: [OrderItem]
 *     responses:
 *       200:
 *         description: Lista de itens de pedido
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *   post:
 *     summary: Criar um novo item de pedido
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: Item de pedido criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 */

/**
 * @swagger
 * /orderItem/{id}:
 *   get:
 *     summary: Obter item de pedido por ID
 *     tags: [OrderItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item de pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Item de pedido não encontrado
 *   put:
 *     summary: Atualizar item de pedido
 *     tags: [OrderItem]
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
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       200:
 *         description: Item de pedido atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *   delete:
 *     summary: Remover item de pedido
 *     tags: [OrderItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Item de pedido removido
 */

router.get('/', orderItemController.getAll);
router.post('/', orderItemController.create);
router.get('/:id', orderItemController.getById);
router.put('/:id', orderItemController.update);
router.delete('/:id', orderItemController.delete);

module.exports = router;
