const { z } = require('zod');

// Criação de item de pedido
const orderItemSchema = z
  .object({
    orderId: z.preprocess(
      (v) => (typeof v === 'string' ? Number(v) : v),
      z.number().int().positive({ message: 'O ID do pedido deve ser um número positivo.' })
    ),
    itemId: z.preprocess(
      (v) => (typeof v === 'string' ? Number(v) : v),
      z.number().int().positive({ message: 'O ID do item deve ser um número positivo.' })
    ),
    quantity: z.preprocess(
      (v) => (typeof v === 'string' ? Number(v) : v),
      z.number().int().positive({ message: 'A quantidade deve ser um número positivo.' })
    ),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Atualização de item de pedido
const updateOrderItemSchema = z
  .object({
    quantity: z.preprocess(
      (v) => (typeof v === 'string' ? Number(v) : v),
      z.number().int().positive({ message: 'A quantidade deve ser um número positivo.' })
    ).optional(),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Middleware de validação
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        campo: e.path.join('.') || 'corpo',
        mensagem: e.message,
      }));

      return res.status(400).json({
        sucesso: false,
        erros: errors,
      });
    }

    req.body = result.data;
    next();
  };
}

module.exports = {
  orderItemSchema,
  updateOrderItemSchema,
  validate,
};
