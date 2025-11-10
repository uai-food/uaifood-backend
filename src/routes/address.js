const express = require('express');
const router = express.Router();
const addressController = require('../controller/address');

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address operations
 */

/**
 * @swagger
 * /address:
 *   get:
 *     summary: Listar todos os endereços
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: Lista de endereços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *   post:
 *     summary: Criar um novo endereço
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Endereço criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 */

/**
 * @swagger
 * /address/{id}:
 *   get:
 *     summary: Obter endereço por ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Endereço não encontrado
 *   put:
 *     summary: Atualizar endereço
 *     tags: [Address]
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
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Endereço atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *   delete:
 *     summary: Remover endereço
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Endereço removido
 */

const { addressSchema, updateAddressSchema, validate } = require('../validation/address.schema');

router.get('/', addressController.getAll);
router.post('/', validate(addressSchema), addressController.create);
router.get('/:id', addressController.getById);
router.put('/:id', validate(updateAddressSchema), addressController.update);
router.delete('/:id', addressController.delete);

module.exports = router;
