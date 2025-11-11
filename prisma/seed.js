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
    { description: 'Pizza Margherita', price: 39.9, category: 'Pizzas', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=800&fit=crop', rating: 4.8 },
    { description: 'Pizza Pepperoni', price: 44.9, category: 'Pizzas', imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=800&fit=crop', rating: 4.9 },
    { description: 'Pizza Quatro Queijos', price: 49.9, category: 'Pizzas', imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96b47?w=800&h=800&fit=crop', rating: 4.7 },
    { description: 'Pizza Calabresa', price: 42.0, category: 'Pizzas', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop', rating: 4.6 },
    { description: 'Pizza Portuguesa', price: 45.5, category: 'Pizzas', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop', rating: 4.8 },

    // Lanches
    { description: 'Hambúrguer Clássico', price: 28.5, category: 'Lanches', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop', rating: 4.7 },
    { description: 'Cheeseburger Bacon', price: 32.0, category: 'Lanches', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=800&fit=crop', rating: 4.9 },
    { description: 'X-Tudo', price: 35.0, category: 'Lanches', imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=800&fit=crop', rating: 4.8 },
    { description: 'Cachorro-Quente Especial', price: 18.0, category: 'Lanches', imageUrl: 'https://images.unsplash.com/photo-1612392062798-2defd01f6742?w=800&h=800&fit=crop', rating: 4.5 },
    { description: 'Sanduíche Natural', price: 15.0, category: 'Lanches', imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=800&fit=crop', rating: 4.4 },

    // Massas
    { description: 'Spaghetti alla Carbonara', price: 29.9, category: 'Massas', imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=800&fit=crop', rating: 4.8 },
    { description: 'Fettuccine Alfredo', price: 31.5, category: 'Massas', imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&h=800&fit=crop', rating: 4.7 },
    { description: 'Lasanha à Bolonhesa', price: 33.0, category: 'Massas', imageUrl: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=800&h=800&fit=crop', rating: 4.9 },
    { description: 'Ravioli de Ricota', price: 27.0, category: 'Massas', imageUrl: 'https://images.unsplash.com/photo-1587740908075-9e97d0ee6c04?w=800&h=800&fit=crop', rating: 4.6 },
    { description: 'Nhoque ao Sugo', price: 26.5, category: 'Massas', imageUrl: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&h=800&fit=crop', rating: 4.5 },

    // Saladas
    { description: 'Salada Caesar com Frango', price: 24.0, category: 'Saladas', imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=800&fit=crop', rating: 4.7 },
    { description: 'Salada Caprese', price: 22.5, category: 'Saladas', imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&h=800&fit=crop', rating: 4.6 },
    { description: 'Salada Verde', price: 18.0, category: 'Saladas', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop', rating: 4.4 },

    // Bebidas
    { description: 'Suco de Laranja Natural', price: 8.5, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop', rating: 4.8 },
    { description: 'Refrigerante Lata', price: 6.0, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&h=800&fit=crop', rating: 4.3 },
    { description: 'Água Mineral', price: 4.5, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=800&fit=crop', rating: 4.5 },
    { description: 'Cerveja Long Neck', price: 9.0, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=800&fit=crop', rating: 4.6 },
    { description: 'Chá Gelado', price: 7.5, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop', rating: 4.4 },

    // Sobremesas
    { description: 'Brownie de Chocolate', price: 12.0, category: 'Sobremesas', imageUrl: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&h=800&fit=crop', rating: 4.9 },
    { description: 'Pudim de Leite', price: 10.0, category: 'Sobremesas', imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=800&fit=crop', rating: 4.7 },
    { description: 'Sorvete Casquinha', price: 8.0, category: 'Sobremesas', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=800&fit=crop', rating: 4.8 },
    { description: 'Torta de Limão', price: 14.0, category: 'Sobremesas', imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&h=800&fit=crop', rating: 4.8 },

    // Petiscos
    { description: 'Batata Frita', price: 12.0, category: 'Petiscos', imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&h=800&fit=crop', rating: 4.6 },
    { description: 'Onion Rings', price: 15.0, category: 'Petiscos', imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&h=800&fit=crop', rating: 4.5 },
    { description: 'Frango à Passarinho', price: 20.0, category: 'Petiscos', imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=800&fit=crop', rating: 4.8 },

    // Cafés
    { description: 'Café Expresso', price: 5.0, category: 'Cafés', imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&h=800&fit=crop', rating: 4.7 },
    { description: 'Café com Leite', price: 6.0, category: 'Cafés', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=800&fit=crop', rating: 4.6 },
    { description: 'Cappuccino', price: 8.0, category: 'Cafés', imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=800&fit=crop', rating: 4.8 },

    // Sucos Naturais
    { description: 'Suco de Abacaxi', price: 9.0, category: 'Sucos Naturais', imageUrl: 'https://images.unsplash.com/photo-1550828486-e97a474a5e9e?w=800&h=800&fit=crop', rating: 4.7 },
    { description: 'Suco de Morango', price: 9.5, category: 'Sucos Naturais', imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&h=800&fit=crop', rating: 4.8 },
    { description: 'Suco Detox', price: 11.0, category: 'Sucos Naturais', imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&h=800&fit=crop', rating: 4.6 },

    // Comidas Brasileiras
    { description: 'Feijoada', price: 25.0, category: 'Comidas Brasileiras', imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&h=800&fit=crop', rating: 4.9 },
    { description: 'Escondidinho de Carne Seca', price: 27.0, category: 'Comidas Brasileiras', imageUrl: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800&h=800&fit=crop', rating: 4.8 },
    { description: 'Moqueca de Peixe', price: 32.0, category: 'Comidas Brasileiras', imageUrl: 'https://images.unsplash.com/photo-1607873111043-b26fbb5f4c06?w=800&h=800&fit=crop', rating: 4.9 },
  ];

  // Cria itens no banco
  const items = [];
  for (const it of itemsData) {
    const cat = categories.find((c) => c.description === it.category) || categories[0];
    // generate an image url using Unsplash featured search based on the first word
    const keyword = encodeURIComponent(it.description.split(' ')[0]);
    const imageUrl = `https://source.unsplash.com/featured/?${keyword},food`;
    // deterministic-ish rating between 3.5 and 5.0
    const rating = Math.round((3.5 + (Math.abs(it.description.length) % 15) / 10) * 10) / 10;
    const created = await prisma.item.create({
      data: { description: it.description, unitPrice: it.price, categoryId: cat.id, imageUrl, rating }
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
