const { z } = require('zod');

// Criação de usuário
const createUserSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'O nome é obrigatório.' })
      .max(50, { message: 'O nome deve ter no máximo 50 caracteres.' }),

    email: z
      .string()
      .email({ message: 'E-mail inválido.' })
      .min(1, { message: 'O e-mail é obrigatório.' }),

    password: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),

    phone: z
      .string()
      .min(8, { message: 'O telefone é inválido.' })
      .max(20, { message: 'O telefone deve ter no máximo 20 caracteres.' })
      .optional(),

    type: z
      .string()
      .max(20, { message: 'O tipo do usuário deve ter no máximo 20 caracteres.' })
      .optional(),

    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'A data de nascimento deve estar no formato YYYY-MM-DD.',
      }),
    // Permitir enviar endereço já no cadastro
    address: z
      .object({
        street: z.string().optional(),
        number: z.string().optional(),
        district: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
      })
      .optional(),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Login de usuário
const loginUserSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'E-mail inválido.' })
      .min(1, { message: 'O e-mail é obrigatório.' }),

    password: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Atualização de usuário
const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'O nome é obrigatório.' })
      .max(50, { message: 'O nome deve ter no máximo 50 caracteres.' })
      .optional(),

    email: z
      .string()
      .email({ message: 'E-mail inválido.' })
      .min(1, { message: 'O e-mail é obrigatório.' })
      .optional(),

    password: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
      .optional(),

    phone: z
      .string()
      .min(8, { message: 'O telefone é inválido.' })
      .max(20, { message: 'O telefone deve ter no máximo 20 caracteres.' })
      .optional(),

    type: z
      .string()
      .max(20, { message: 'O tipo do usuário deve ter no máximo 20 caracteres.' })
      .optional(),

    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'A data de nascimento deve estar no formato YYYY-MM-DD.',
      })
      .optional(),
    // permitir atualizar endereço via API administrativa
    address: z
      .object({
        street: z.string().optional(),
        number: z.string().optional(),
        district: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
      })
      .optional(),
  })
  .strict({
    message: 'O corpo da requisição contém campos não permitidos.',
  });

// Atualizar perfil (usado em /user/profile)
const updateProfileSchema = z
  .object({
    name: z.string().min(1).max(50).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(8).max(20).optional(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    address: z
      .object({
        street: z.string().optional(),
        number: z.string().optional(),
        district: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
      })
      .optional(),
  })
  .strict({ message: 'O corpo da requisição contém campos não permitidos.' });

// Troca de senha
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, { message: 'Senha atual inválida.' }),
    newPassword: z.string().min(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' }),
  })
  .strict({ message: 'O corpo da requisição contém campos não permitidos.' });

// Middleware de validação
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Tratamento para evitar erro caso result.error seja undefined
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
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  validate,
};
