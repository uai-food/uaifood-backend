const { z } = require('zod');

// Criação de categoria
const categorySchema = z
  .object({
    description: z
      .string()
      .min(1, { message: 'A descrição da categoria é obrigatória.' })
      .max(255, { message: 'A descrição da categoria deve ter no máximo 255 caracteres.' }),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Atualização de categoria
const updateCategorySchema = categorySchema.partial();

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
  categorySchema,
  updateCategorySchema,
  validate,
};
