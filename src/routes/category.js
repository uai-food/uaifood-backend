const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category');

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category operations
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Criar uma nova categoria
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Categoria criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Obter categoria por ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoria não encontrada
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Category]
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   delete:
 *     summary: Delete category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Categoria removida
 */

const { categorySchema, updateCategorySchema, validate } = require('../validation/category.schema');

router.get('/', categoryController.getAll);
router.post('/', validate(categorySchema), categoryController.create);
router.get('/:id', categoryController.getById);
router.put('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;
