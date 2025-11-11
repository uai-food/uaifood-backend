const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os pedidos
exports.getAll = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        client: true,
        createdBy: true,
        items: { include: { item: true } }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar pedido
exports.create = async (req, res) => {
  try {
    const { clientId, paymentMethod, status, createdById, items } = req.body;
    const order = await prisma.order.create({
      data: {
        clientId: BigInt(clientId),
        paymentMethod,
        status,
        createdById: createdById ? BigInt(createdById) : null,
        items: {
          create: items.map(i => ({
            itemId: BigInt(i.itemId),
            quantity: i.quantity
          }))
        }
      },
      include: {
        items: true
      }
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar pedido por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: BigInt(id) },
      include: {
        client: true,
        createdBy: true,
        items: { include: { item: true } }
      }
    });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar pedido
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, status } = req.body;
    const order = await prisma.order.update({
      where: { id: BigInt(id) },
      data: { paymentMethod, status }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar pedido
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({
      where: { id: BigInt(id) }
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retornar pedidos do usuário autenticado (client)
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
    const orders = await prisma.order.findMany({
      where: { clientId: BigInt(userId) },
      include: {
        client: true,
        createdBy: true,
        items: { include: { item: true } }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
