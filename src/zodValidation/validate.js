// Middleware central de validação — reutiliza a implementação do user.schema.js
const { validate } = require('./user.schema');

module.exports = validate;
