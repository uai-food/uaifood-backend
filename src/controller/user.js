const prisma = require('../../prisma/prismaClient');
const bcrypt = require('bcrypt');
const jwtConfig = require('../../auth/jwtConfigs');
const { get } = require('../routes/user');

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


// Retorna perfil do usuário autenticado (usado pelo frontend)
async function getProfile(req, res) {
    try {
        console.log('getProfile req.user:', req.user);
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
        // Incluir endereço na resposta para o frontend exibir e editar
        const user = await prisma.user.findUnique({ where: { id: Number(userId) }, include: { address: true } });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        // Não retornar a senha
        const { password, ...safe } = user;
        return res.status(200).json(safe);
    } catch (error) {
        console.error('getProfile error:', error && error.message ? error.message : error);
        return res.status(500).json({ error: (error && error.message) || 'Erro ao buscar perfil.' });
    }
}

// Atualiza perfil do usuário autenticado (nome, email, phone, birthDate e endereço)
async function updateProfile(req, res) {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });

        const { name, email, phone, birthDate, address } = req.body;

        // Se email for fornecido, verificar unicidade
        if (email) {
            const userWithEmail = await prisma.user.findUnique({ where: { email } });
            if (userWithEmail && userWithEmail.id.toString() !== userId.toString()) {
                return res.status(400).json({ error: 'E-mail já cadastrado por outro usuário.' });
            }
        }
        
        // Trata endereço: create ou update
        let addressId = null;
        const currentUser = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (address) {
            if (currentUser && currentUser.addressId) {
                // atualizar
                const updatedAddress = await prisma.address.update({
                    where: { id: Number(currentUser.addressId) },
                    data: address,
                });
                addressId = updatedAddress.id;
            } else {
                // criar
                const createdAddress = await prisma.address.create({ data: address });
                addressId = createdAddress.id;
            }
        }
        
        const data = {};
        if (name !== undefined) data.name = name;
        if (email !== undefined) data.email = email;
        if (phone !== undefined) data.phone = phone;
        if (birthDate !== undefined) data.birthDate = new Date(birthDate);
        if (addressId) data.addressId = addressId;
        
        const updatedUser = await prisma.user.update({ where: { id: Number(userId) }, data });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('updateProfile error:', error && error.message ? error.message : error);
        return res.status(400).json({ error: 'Erro ao atualizar perfil.' });
    }
}

// Alterar senha (usuário autenticado) - valida oldPassword
async function changePassword(req, res) {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
        
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) return res.status(400).json({ error: 'oldPassword e newPassword são obrigatórios.' });

        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(401).json({ error: 'Senha atual incorreta.' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: Number(userId) }, data: { password: hashed } });
        return res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (error) {
        console.error('changePassword error:', error && error.message ? error.message : error);
        return res.status(500).json({ error: 'Erro ao alterar senha.' });
    }
}

//Promover usuário para ADMIN (somente ADMIN pode chamar)
async function promoteUser(req, res) {
    try {
        const requesterId = req.user && req.user.id;
        if (!requesterId) return res.status(401).json({ error: 'Usuário não autenticado.' });
        
        // verifica se solicitante é ADMIN
        console.log('promoteUser called by requesterId=', requesterId, 'params=', req.params);
        
        const requester = await prisma.user.findUnique({ where: { id: Number(requesterId) } });
        if (!requester) {
            console.warn('promoteUser: requester not found', requesterId);
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        if (requester.type !== 'ADMIN') {
            console.warn('promoteUser: requester not admin', requesterId, requester.type);
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        
        const { id } = req.params;
        console.log('promoteUser: target id=', id);
        const target = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!target) {
            console.warn('promoteUser: target not found', id);
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        
        const updated = await prisma.user.update({ where: { id: Number(id) }, data: { type: 'ADMIN' } });
        return res.status(200).json(updated);
    } catch (error) {
        console.error('promoteUser error:', error && error.message ? error.message : error);
        return res.status(500).json({ error: (error && error.message) || 'Erro ao promover usuário.' });
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
    getProfile,
    updateProfile,
    changePassword,
    promoteUser,
};
