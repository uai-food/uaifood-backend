const { z } = require('zod');

// Enum para forma de pagamento
const paymentMethodEnum = z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX'], {
  errorMap: () => ({
    message: 'Forma de pagamento inválida. Use: CASH, DEBIT, CREDIT ou PIX.',
  }),
});

// Enum para status do pedido
const statusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
  errorMap: () => ({
    message: 'Status inválido. Use: PENDING, IN_PROGRESS, COMPLETED ou CANCELLED.',
  }),
});

// Itens do pedido
const orderItemInnerSchema = z.object({
  itemId: z.preprocess(
    (v) => (typeof v === 'string' ? Number(v) : v),
    z.number().int().positive({ message: 'O ID do item deve ser um número positivo.' })
  ),
  quantity: z.preprocess(
    (v) => (typeof v === 'string' ? Number(v) : v),
    z.number().int().positive({ message: 'A quantidade deve ser um número positivo.' })
  ),
});

// Criação de pedido
const orderSchema = z
  .object({
    clientId: z.preprocess(
      (v) => (typeof v === 'string' ? Number(v) : v),
      z.number().int().positive({ message: 'O ID do cliente deve ser um número positivo.' })
    ),
    paymentMethod: paymentMethodEnum,
    status: statusEnum.default('PENDING'),
    createdById: z
      .union([
        z.preprocess(
          (v) => (typeof v === 'string' ? Number(v) : v),
          z.number().int().positive({ message: 'O ID do criador deve ser um número positivo.' })
        ),
        z.null(),
      ])
      .optional(),
    items: z
      .array(orderItemInnerSchema)
      .min(1, { message: 'O pedido deve conter pelo menos um item.' }),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Atualização de pedido
const updateOrderSchema = z
  .object({
    paymentMethod: paymentMethodEnum.optional(),
    status: statusEnum.optional(),
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
  orderSchema,
  updateOrderSchema,
  validate,
};
