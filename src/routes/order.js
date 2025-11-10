const express = require('express');
const router = express.Router();
const orderController = require('../controller/order');

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order operations
 */

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Listar todos os pedidos
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Pedido criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Obter pedido por ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 *   put:
 *     summary: Atualizar pedido
 *     tags: [Order]
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
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *   delete:
 *     summary: Delete order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pedido removido
 */

const { orderSchema, updateOrderSchema, validate } = require('../validation/order.schema');

router.get('/', orderController.getAll);
router.post('/', validate(orderSchema), orderController.create);
router.get('/:id', orderController.getById);
router.put('/:id', validate(updateOrderSchema), orderController.update);
router.delete('/:id', orderController.delete);

module.exports = router;
