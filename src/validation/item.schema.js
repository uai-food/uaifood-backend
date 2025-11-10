const { z } = require('zod');

// Criação de item
const itemSchema = z
  .object({
    description: z
      .string()
      .min(1, { message: 'A descrição é obrigatória.' })
      .max(255, { message: 'A descrição deve ter no máximo 255 caracteres.' }),

    unitPrice: z.preprocess(
      (v) => (typeof v === 'string' ? Number(v) : v),
      z
        .number({ invalid_type_error: 'O valor do item deve ser um número.' })
        .positive({ message: 'O valor do item deve ser positivo.' })
    ),

    categoryId: z.preprocess(
      (v) => (typeof v === 'string' ? Number(v) : v),
      z
        .number({ invalid_type_error: 'O ID da categoria deve ser um número.' })
        .int({ message: 'O ID da categoria deve ser um número inteiro.' })
        .positive({ message: 'O ID da categoria deve ser positivo.' })
    ),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Atualização de item
const updateItemSchema = z
  .object({
    description: z
      .string()
      .min(1, { message: 'A descrição é obrigatória.' })
      .max(255, { message: 'A descrição deve ter no máximo 255 caracteres.' })
      .optional(),

    unitPrice: z
      .preprocess(
        (v) => (typeof v === 'string' ? Number(v) : v),
        z
          .number({ invalid_type_error: 'O valor do item deve ser um número.' })
          .positive({ message: 'O valor do item deve ser positivo.' })
      )
      .optional(),

    categoryId: z
      .preprocess(
        (v) => (typeof v === 'string' ? Number(v) : v),
        z
          .number({ invalid_type_error: 'O ID da categoria deve ser um número.' })
          .int({ message: 'O ID da categoria deve ser um número inteiro.' })
          .positive({ message: 'O ID da categoria deve ser positivo.' })
      )
      .optional(),
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
  itemSchema,
  updateItemSchema,
  validate,
};
