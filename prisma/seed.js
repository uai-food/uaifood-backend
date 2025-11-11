const prisma = require('../prisma/prismaClient');
const bcrypt = require('bcrypt');

async function main() {
  console.log('Iniciando o seed do banco de dados...');

  // Limpa todas as tabelas na ordem correta (por causa das chaves estrangeiras)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Cria categorias
  const categoriesData = [
    'Pizzas',
    'Lanches',
    'Massas',
    'Saladas',
    'Bebidas',
    'Sobremesas',
    'Petiscos',
    'Cafés',
    'Sucos Naturais',
    'Comidas Brasileiras',
  ];

  const categories = [];
  for (const desc of categoriesData) {
    const c = await prisma.category.create({ data: { description: desc } });
    categories.push(c);
  }

  // Cria itens (cardápio)
  const itemsData = [
    // Pizzas
    { description: 'Pizza Margherita', price: 39.9, category: 'Pizzas' },
    { description: 'Pizza Pepperoni', price: 44.9, category: 'Pizzas' },
    { description: 'Pizza Quatro Queijos', price: 49.9, category: 'Pizzas' },
    { description: 'Pizza Calabresa', price: 42.0, category: 'Pizzas' },
    { description: 'Pizza Portuguesa', price: 45.5, category: 'Pizzas' },

    // Lanches
    { description: 'Hambúrguer Clássico', price: 28.5, category: 'Lanches' },
    { description: 'Cheeseburger Bacon', price: 32.0, category: 'Lanches' },
    { description: 'X-Tudo', price: 35.0, category: 'Lanches' },
    { description: 'Cachorro-Quente Especial', price: 18.0, category: 'Lanches' },
    { description: 'Sanduíche Natural', price: 15.0, category: 'Lanches' },

    // Massas
    { description: 'Spaghetti alla Carbonara', price: 29.9, category: 'Massas' },
    { description: 'Fettuccine Alfredo', price: 31.5, category: 'Massas' },
    { description: 'Lasanha à Bolonhesa', price: 33.0, category: 'Massas' },
    { description: 'Ravioli de Ricota', price: 27.0, category: 'Massas' },
    { description: 'Nhoque ao Sugo', price: 26.5, category: 'Massas' },

    // Saladas
    { description: 'Salada Caesar com Frango', price: 24.0, category: 'Saladas' },
    { description: 'Salada Caprese', price: 22.5, category: 'Saladas' },
    { description: 'Salada Verde', price: 18.0, category: 'Saladas' },

    // Bebidas
    { description: 'Suco de Laranja Natural', price: 8.5, category: 'Bebidas' },
    { description: 'Refrigerante Lata', price: 6.0, category: 'Bebidas' },
    { description: 'Água Mineral', price: 4.5, category: 'Bebidas' },
    { description: 'Cerveja Long Neck', price: 9.0, category: 'Bebidas' },
    { description: 'Chá Gelado', price: 7.5, category: 'Bebidas' },

    // Sobremesas
    { description: 'Brownie de Chocolate', price: 12.0, category: 'Sobremesas' },
    { description: 'Pudim de Leite', price: 10.0, category: 'Sobremesas' },
    { description: 'Sorvete Casquinha', price: 8.0, category: 'Sobremesas' },
    { description: 'Torta de Limão', price: 14.0, category: 'Sobremesas' },

    // Petiscos
    { description: 'Batata Frita', price: 12.0, category: 'Petiscos' },
    { description: 'Onion Rings', price: 15.0, category: 'Petiscos' },
    { description: 'Frango à Passarinho', price: 20.0, category: 'Petiscos' },

    // Cafés
    { description: 'Café Expresso', price: 5.0, category: 'Cafés' },
    { description: 'Café com Leite', price: 6.0, category: 'Cafés' },
    { description: 'Cappuccino', price: 8.0, category: 'Cafés' },

    // Sucos Naturais
    { description: 'Suco de Abacaxi', price: 9.0, category: 'Sucos Naturais' },
    { description: 'Suco de Morango', price: 9.5, category: 'Sucos Naturais' },
    { description: 'Suco Detox', price: 11.0, category: 'Sucos Naturais' },

    // Comidas Brasileiras
    { description: 'Feijoada', price: 25.0, category: 'Comidas Brasileiras' },
    { description: 'Escondidinho de Carne Seca', price: 27.0, category: 'Comidas Brasileiras' },
    { description: 'Moqueca de Peixe', price: 32.0, category: 'Comidas Brasileiras' },
  ];

  // Cria itens no banco
  const items = [];
  for (const it of itemsData) {
    const cat = categories.find((c) => c.description === it.category) || categories[0];
    const created = await prisma.item.create({
      data: { description: it.description, unitPrice: it.price, categoryId: cat.id }
    });
    items.push(created);
  }

  // Cria usuários
  const usersData = [
    { name: 'Admin User', email: 'admin@uaifood.test', password: 'admin123', type: 'ADMIN' },
    { name: 'Carlos Cliente', email: 'carlos@cliente.test', password: 'password123', type: 'CLIENT' },
    { name: 'Maria Cliente', email: 'maria@cliente.test', password: 'password123', type: 'CLIENT' },
    { name: 'José Cliente', email: 'jose@cliente.test', password: 'password123', type: 'CLIENT' },
    { name: 'Ana Cliente', email: 'ana@cliente.test', password: 'password123', type: 'CLIENT' },
    { name: 'Pedro Cliente', email: 'pedro@cliente.test', password: 'password123', type: 'CLIENT' },
  ];

  const users = [];
  for (const u of usersData) {
    const hash = await bcrypt.hash(u.password, 10);
    const created = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hash,
        birthDate: new Date('1990-01-01'),
        phone: '11999999999',
        type: u.type
      }
    });
    users.push(created);
  }

  // Cria endereços para clientes
  for (let i = 1; i < users.length; i++) {
    await prisma.address.create({
      data: {
        street: `Rua Teste ${i}`,
        number: `${100 + i}`,
        district: 'Centro',
        city: 'Uberaba',
        state: 'MG',
        zipCode: '38000-000',
        users: { connect: { id: users[i].id } }
      }
    });
  }

  // Cria pedidos para os clientes
  for (let i = 1; i < users.length; i++) {
    const client = users[i];
    const orderItems = [];
    for (let j = 0; j < 3; j++) { // 3 itens por pedido
      const it = items[(i * 3 + j) % items.length];
      orderItems.push({ itemId: it.id, quantity: 1 + (j % 3) });
    }
    await prisma.order.create({
      data: {
        clientId: client.id,
        paymentMethod: 'PIX',
        status: 'PENDING',
        createdById: users[0].id,
        items: {
          create: orderItems.map((oi) => ({ itemId: oi.itemId, quantity: oi.quantity }))
        }
      }
    });
  }

  console.log('Seed finalizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
