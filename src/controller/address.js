const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os endereços
exports.getAll = async (req, res) => {
	try {
		const addresses = await prisma.address.findMany();
		res.json(addresses);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Criar um endereço
exports.create = async (req, res) => {
	try {
		const { street, number, district, city, state, zipCode } = req.body;
		const address = await prisma.address.create({
			data: { street, number, district, city, state, zipCode }
		});
		res.status(201).json(address);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Buscar endereço por ID
exports.getById = async (req, res) => {
	try {
		const { id } = req.params;
		const address = await prisma.address.findUnique({ where: { id: BigInt(id) } });
		if (!address) return res.status(404).json({ error: 'Endereço não encontrado' });
		res.json(address);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Atualizar endereço
exports.update = async (req, res) => {
	try {
		const { id } = req.params;
		const { street, number, district, city, state, zipCode } = req.body;
		const address = await prisma.address.update({
			where: { id: BigInt(id) },
			data: { street, number, district, city, state, zipCode }
		});
		res.json(address);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Deletar endereço
exports.delete = async (req, res) => {
	try {
		const { id } = req.params;
		await prisma.address.delete({ where: { id: BigInt(id) } });
		res.status(204).end();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
