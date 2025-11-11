const prisma = require('../../prisma/prismaClient');
const bcrypt = require('bcrypt');
const jwtConfig = require('../../auth/jwtConfigs');

// Criar usuário
async function createUser(req, res) {
    const { name, email, password, birthDate, phone } = req.body;
    try {
        // Verifica se já existe usuário com o mesmo email
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }
        const senhaCriptografada = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: senhaCriptografada,
                birthDate: new Date(birthDate),
                phone,
                type: "CLIENT"
            },
        });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Erro ao criar usuário.' });
    }
}

// Listar usuários
async function listUsers(req, res) {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar usuários.' });
    }
}
// Listar usuário por ID
async function getUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
}

// Atualizar usuário
async function updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password, birthDate } = req.body;
    try {
        // Se email for fornecido, verificar unicidade
        if (email) {
            const userWithEmail = await prisma.user.findUnique({ where: { email } });
            if (userWithEmail && userWithEmail.id.toString() !== id.toString()) {
                return res.status(400).json({ error: 'E-mail já cadastrado por outro usuário.' });
            }
        }

        const data = {};
        if (name !== undefined) data.name = name;
        if (email !== undefined) data.email = email;
        if (password !== undefined) data.password = await bcrypt.hash(password, 10);
        if (birthDate !== undefined) data.birthDate = new Date(birthDate);

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data,
        });
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao atualizar usuário.' });
    }
}

// Deletar usuário
async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: Number(id) } });
        return res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao deletar usuário.' });
    }
}

// Login de usuário
async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        console.log('Login attempt for email:', email);
        const user = await prisma.user.findUnique({ where: { email } });
        console.log('User found:', !!user, user ? { id: user.id, email: user.email } : null);
        if (!user) {
            console.log('Login failed: user not found');
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const match = await bcrypt.compare(password, user.password);
        console.log('bcrypt.compare result for', email, ':', match);
        if (!match) {
            console.log('Login failed: password mismatch for', email);
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

    const token = jwtConfig.generateToken(user.id.toString());
    // remove password before returning user
    const { password: _pwd, ...userSafe } = Object.assign({}, user);
    return res.status(200).json({ token, user: userSafe });
    } catch (error) {
        console.error('loginUser error:', error && error.message ? error.message : error);
        return res.status(500).json({ error: 'Erro ao efetuar login.' });
    }
}

// Autenticação de token
async function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ error: 'Token ausente' });
    try {
        const payload = await jwtConfig.verifyToken(token);
        // normalizar id como number para usar com Prisma (que nas rotinas abaixo usa Number(id))
        const id = payload && payload.id ? Number(payload.id) : undefined;
        req.user = { ...payload, id };
        next();
    } catch (error) {
        console.error('JWT verify error:', error && error.message ? error.message : error);
        return res.status(403).json({ error: (error && error.message) || 'Token inválido' });
    }
}

module.exports = {
    createUser,
    listUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    autenticarToken,
};

// Retorna perfil do usuário autenticado (usado pelo frontend)
async function getProfile(req, res) {
    try {
        console.log('getProfile req.user:', req.user);
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        return res.status(200).json(user);
    } catch (error) {
          console.error('getProfile error:', error && error.message ? error.message : error);
          return res.status(500).json({ error: (error && error.message) || 'Erro ao buscar perfil.' });
    }
}

// Exporta getProfile
module.exports.getProfile = getProfile;


