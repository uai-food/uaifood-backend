const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os pedidos

exports.getAll = (req, res) => {
  prisma.order.findMany({
    include: {
      client: true,
      createdBy: true,
      items: { include: { item: true } }
    }
  })
  .then(orders => res.json(orders))
  .catch(error => res.status(500).json({ error: error.message }));
};

// Criar pedido
exports.create = (req, res) => {
  const { clientId, paymentMethod, status, createdById, items } = req.body;

  prisma.order.create({
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
    include: { items: true }
  })
  .then(order => {
    // Inicia a simulação automática do ciclo de vida do pedido
    try {
      startSimulationForOrder(order.id).catch(err =>
        console.error('Erro na simulação em segundo plano:', err)
      );
    } catch (e) {
      console.error('Falha ao iniciar simulação em segundo plano:', e);
    }

    res.status(201).json(order);
  })
  .catch(error => res.status(500).json({ error: error.message }));
};

// Buscar pedido por ID
exports.getById = (req, res) => {
  const { id } = req.params;

  prisma.order.findUnique({
    where: { id: BigInt(id) },
    include: {
      client: true,
      createdBy: true,
      items: { include: { item: true } }
    }
  })
  .then(order => {
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  })
  .catch(error => res.status(500).json({ error: error.message }));
};

// Atualizar pedido
exports.update = (req, res) => {
  const { id } = req.params;
  const { paymentMethod, status } = req.body;

  prisma.order.update({
    where: { id: BigInt(id) },
    data: { paymentMethod, status }
  })
  .then(order => res.json(order))
  .catch(error => res.status(500).json({ error: error.message }));
};

// Deletar pedido
exports.delete = (req, res) => {
  const { id } = req.params;

  prisma.order.delete({
    where: { id: BigInt(id) }
  })
  .then(() => res.status(204).end())
  .catch(error => res.status(500).json({ error: error.message }));
};

//
// Retornar pedidos do usuário autenticado (cliente)
//
exports.getMyOrders = (req, res) => {
  const userId = req.user && req.user.id;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  prisma.order.findMany({
    where: { clientId: BigInt(userId) },
    include: {
      client: true,
      createdBy: true,
      items: { include: { item: true } }
    }
  })
  .then(orders => res.json(orders))
  .catch(error => res.status(500).json({ error: error.message }));
};


// Função auxiliar que simula o ciclo de vida do pedido (com Promises encadeadas)

const SIMULATION_DELAYS = {
  toPaid: 5000,           // tempo até mudar para "Pago"
  toPreparing: 15000,     // tempo até mudar para "Preparando"
  toOutForDelivery: 30000, // tempo até mudar para "Saiu para entrega"
  toDelivered: 20000,     // tempo até mudar para "Entregue"
};

function startSimulationForOrder(orderId, delays = SIMULATION_DELAYS) {
  const idBig = (typeof orderId === 'bigint') ? orderId : BigInt(String(orderId));
  console.log('Iniciando simulação para o pedido', String(idBig));

  // Retorna uma Promise que atualiza o status após um tempo
  const updateStatusAfter = (newStatus, delayMs) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        prisma.order.update({
          where: { id: idBig },
          data: { status: newStatus }
        })
        .then(updated => {
          console.log(`Pedido ${String(idBig)} atualizado para ${newStatus}`);
          resolve(updated);
        })
        .catch(err => {
          console.error('Erro ao atualizar status do pedido:', err);
          reject(err);
        });
      }, delayMs);
    });
  };

  // Encadeamento das Promises
  updateStatusAfter('PAID', delays.toPaid)
    .then(() => updateStatusAfter('PREPARING', delays.toPreparing))
    .then(() => updateStatusAfter('OUT_FOR_DELIVERY', delays.toOutForDelivery))
    .then(() => updateStatusAfter('DELIVERED', delays.toDelivered))
    .then(() => {
      console.log(`Simulação concluída para o pedido ${String(idBig)}.`);
    })
    .catch(err => {
      console.error('Erro durante a simulação do pedido', String(idBig), err);
    });
}
