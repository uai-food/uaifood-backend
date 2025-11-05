const prisma = require('../../prisma/prismaClient');
const bcrypt = require('bcrypt');

// Create
async function createUser(req, res) {
    const { name, email, password, birthDate, type } = req.body;
    try {
        const senhaCriptografada = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password : senhaCriptografada,
                birthDate: new Date(birthDate),
                type,
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

module.exports = {
    createUser,
    listUsers,
    getUserById,
    updateUser,
    deleteUser
};


