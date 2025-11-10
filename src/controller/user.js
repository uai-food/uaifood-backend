const prisma = require('../../prisma/prismaClient');
const bcrypt = require('bcrypt');
const jwtConfig = require('../../auth/jwtConfigs');

// Create
async function createUser(req, res) {
    const { name, email, password, birthDate, type, phone } = req.body;
    try {
        const senhaCriptografada = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password : senhaCriptografada,
                birthDate: new Date(birthDate),
                type,
                phone,
            },
        });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error); // Mostra no terminal
        return res.status(400).json({ error: 'Error creating user.' });
    }
}

// Read all
async function listUsers(req, res) {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Error listing users.' });
    }
}

// Read by ID
async function getUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching user.' });
    }
}

// Update
async function updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password, birthDate } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name,
                email,
                password,
                birthDate: new Date(birthDate),
            },
        });
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({ error: 'Error updating user.' });
    }
}

// Delete
async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: Number(id) } });
        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        return res.status(400).json({ error: 'Error deleting user.' });
    }
}

// Login
async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }
    const token = jwtConfig.generateToken({ id: user.id.toString() });

    return res.status(200).json({ token });
}

// Authentication
async function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    try {
        const user = await jwtConfig.verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
return res.sendStatus(403);
}
}

module.exports = {
    createUser,
    listUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    autenticarToken
};


