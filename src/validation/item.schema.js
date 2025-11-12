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
    imageUrl: z.string().url({ message: 'imageUrl deve ser uma URL válida.' }).optional(),
    rating: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().optional()),
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
    imageUrl: z.string().url({ message: 'imageUrl deve ser uma URL válida.' }).optional(),
    rating: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().optional()).optional(),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Middleware de validação
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const rawErrors = (result.error && Array.isArray(result.error.errors))
        ? result.error.errors
        : [{ path: [], message: result.error ? result.error.message || 'Erro de validação' : 'Erro de validação' }];

      const errors = rawErrors.map((e) => ({
        campo: (e.path && e.path.length ? e.path.join('.') : 'corpo'),
        mensagem: e.message || 'Campo inválido',
      }));

      return res.status(400).json({ sucesso: false, erros: errors });
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
