const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os itens
exports.getAll = async (req, res) => {
  try {
    const items = await prisma.item.findMany({ include: { category: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um item
exports.create = async (req, res) => {
  try {
    const { description, unitPrice, categoryId, imageUrl, rating } = req.body;
    // validação de categoryId
    if (categoryId === undefined || categoryId === null) {
      return res.status(400).json({ error: 'categoryId é obrigatório' });
    }
    const category = await prisma.category.findUnique({ where: { id: BigInt(categoryId) } });
    if (!category) return res.status(400).json({ error: 'Categoria inválida' });

    const data = {
      description,
      unitPrice,
      categoryId: BigInt(categoryId),
    };
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (rating !== undefined) data.rating = rating;

    const item = await prisma.item.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Erros conhecidos do Prisma (por exemplo, falha de restrição de chave estrangeira)
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Referência inválida ao criar item.' });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Recurso não encontrado.' });
      }
    }
    res.status(500).json({ error: error.message });
  }
};

// Buscar item por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: BigInt(id) },
      include: { category: true }
    });
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar item
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
  const { description, unitPrice, categoryId, imageUrl, rating } = req.body;
    // validação de categoryId
    if (categoryId !== undefined && categoryId !== null) {
      const category = await prisma.category.findUnique({ where: { id: BigInt(categoryId) } });
      if (!category) return res.status(400).json({ error: 'Categoria inválida' });
    }

    const data = {};
    if (description !== undefined) data.description = description;
    if (unitPrice !== undefined) data.unitPrice = unitPrice;
    if (categoryId !== undefined && categoryId !== null) data.categoryId = BigInt(categoryId);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (rating !== undefined) data.rating = rating;

    const item = await prisma.item.update({
      where: { id: BigInt(id) },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Item não encontrado.' });
      }
    }
    res.status(500).json({ error: error.message });
  }
};

// Deletar item
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.item.delete({
      where: { id: BigInt(id) }
    });
    res.status(204).end();
  } catch (error) {
    // Lidar com erros de restrição de chave estrangeira do Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2003: Falha na restrição de chave estrangeira
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Não é possível excluir este item: existem pedidos que o referenciam.' });
      }
      // P2025: O registro a ser deletado não existe
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Item não encontrado.' });
      }
    }
    res.status(500).json({ error: error.message });
  }
};
