const { z } = require('zod');

// Criação de endereço
const addressSchema = z
  .object({
    street: z
      .string()
      .min(1, { message: 'A rua é obrigatória.' })
      .max(255, { message: 'A rua deve ter no máximo 255 caracteres.' }),

    number: z
      .string()
      .min(1, { message: 'O número é obrigatório.' })
      .max(50, { message: 'O número deve ter no máximo 50 caracteres.' }),

    district: z
      .string()
      .min(1, { message: 'O bairro é obrigatório.' })
      .max(100, { message: 'O bairro deve ter no máximo 100 caracteres.' }),

    city: z
      .string()
      .min(1, { message: 'A cidade é obrigatória.' })
      .max(100, { message: 'A cidade deve ter no máximo 100 caracteres.' }),

    state: z
      .string()
      .min(1, { message: 'O estado é obrigatório.' })
      .max(100, { message: 'O estado deve ter no máximo 100 caracteres.' }),

    zipCode: z
      .string()
      .min(4, { message: 'O CEP é inválido.' })
      .max(20, { message: 'O CEP deve ter no máximo 20 caracteres.' }),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Atualização de endereço
const updateAddressSchema = addressSchema.partial();

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
  addressSchema,
  updateAddressSchema,
  validate,
};
