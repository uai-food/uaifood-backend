const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Exemplo com Swagger',
      version: '1.0.0',
      description: 'API para exemplo de documentação Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de dev'
      },
    ],
    components: {
      schemas: {
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            description: { type: 'string', example: 'Bebidas' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Item: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            description: { type: 'string', example: 'Coca-Cola' },
            unitPrice: { type: 'number', example: 5.99 },
            categoryId: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            clientId: { type: 'integer', example: 1 },
            paymentMethod: { type: 'string', example: 'CASH' },
            status: { type: 'string', example: 'PENDENTE' },
            total: { type: 'number', example: 45.5 },
            createdById: { type: 'integer', example: 2 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' }
            }
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            orderId: { type: 'integer', example: 1 },
            itemId: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 2 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
        ,
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Stefani Joanne' },
            email: { type: 'string', example: 'stefani@teste.com' },
            phone: { type: 'string', example: '1133333333' },
            type: { type: 'string', example: 'CLIENT' },
            birthDate: { type: 'string', format: 'date', example: '2000-01-15' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        UpdateUser: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            type: { type: 'string' },
            birthDate: { type: 'string', format: 'date' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        Address: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            street: { type: 'string', example: 'Av. Paulista' },
            number: { type: 'string', example: '1000' },
            complement: { type: 'string', example: 'Apto 101' },
            district: { type: 'string', example: 'Bela Vista' },
            city: { type: 'string', example: 'São Paulo' },
            state: { type: 'string', example: 'SP' },
            zipCode: { type: 'string', example: '01310-000' },
            userId: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Define onde os endpoints estão descritos
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
