const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const bcrypt = require('bcrypt');

// Caso o banco tenha campos BigInt
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Lê o arquivo exportado do banco 
const data = JSON.parse(fs.readFileSync('./prisma/exported-seed.json', 'utf-8'));

async function main() {
  console.log('Limpando tabelas...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();

  console.log('Inserindo dados exportados...');

  // Cria categorias
  if (data.categories?.length) {
    await prisma.category.createMany({ data: data.categories });
  }

  // Cria itens
  if (data.items?.length) {
    await prisma.item.createMany({ data: data.items });
  }

  // Cria endereços (parents for users)
  if (data.addresses?.length) {
    await prisma.address.createMany({ data: data.addresses });
  }

  // Ajustar sequences para evitar conflitos de IDs ao usar bigserial + inserts com IDs explícitos
  const resetSequence = async (tableName) => {
    try {
      await prisma.$executeRawUnsafe(
        `SELECT setval(
         pg_get_serial_sequence('"${tableName}"','id'),
         COALESCE((SELECT MAX(id) FROM "${tableName}"), 0) + 1,
         false
       )`
      );
    } catch (e) {
      console.warn('Não foi possível ajustar sequence para', tableName, e.message || e);
    }
  };


  // Cria usuários
  if (data.users?.length) {
    const usersWithHashedPasswords = await Promise.all(
      data.users.map(async (u) => ({
        ...u,
        password: u.password.startsWith('$2b$') ? u.password : await bcrypt.hash(u.password, 10),
      }))
    );
    await prisma.user.createMany({ data: usersWithHashedPasswords });
  }

  // Reset sequences after inserting data with explicit ids
  await resetSequence('Category');
  await resetSequence('Item');
  await resetSequence('Address');
  await resetSequence('User');
  await resetSequence('Order');
  await resetSequence('OrderItem');

  // Cria pedidos
  if (data.orders?.length) {
    await prisma.order.createMany({ data: data.orders });
  }

  // Cria itens de pedido
  if (data.orderItems?.length) {
    await prisma.orderItem.createMany({ data: data.orderItems });
  }

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((err) => {
    console.error('Erro ao rodar seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
