const jwt = require('jsonwebtoken');
// Gera um token JWT com 1h de expiração
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_JWT, { expiresIn: '1h' });
}

// Verifica se o token é válido e retorna o payload
const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET_JWT);
}

module.exports = { generateToken, verifyToken };
