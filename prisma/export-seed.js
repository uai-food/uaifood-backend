// prisma/export-seed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

// Adiciona um replacer que converte BigInt para string
BigInt.prototype.toJSON = function () {
  return this.toString();
};

async function main() {
  const categories = await prisma.category.findMany();
  const items = await prisma.item.findMany();
  const users = await prisma.user.findMany();
  const addresses = await prisma.address.findMany();
  const orders = await prisma.order.findMany();
  const orderItems = await prisma.orderItem.findMany();

  const data = { categories, items, users, addresses, orders, orderItems };

  fs.writeFileSync('./prisma/exported-seed.json', JSON.stringify(data, null, 2));
  console.log('Dados exportados para prisma/exported-seed.json');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
