const express = require('express');
const cors = require('cors');
const app = express();
const user = require('./src/routes/user'); //importa o arquivo usuarios.js
const category = require('./src/routes/category');
const item = require('./src/routes/item');
const order = require('./src/routes/order');
const orderItem = require('./src/routes/orderItem');
const address = require('./src/routes/address');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./configs/swaggerConfig');
require('dotenv').config();

// Corrige erro de BigInt no JSON
BigInt.prototype.toJSON = function() {
  return Number(this);
};

app.use(express.json());

// Habilita CORS para permitir requisições do frontend (Vite/dev)
app.use(cors());

// Conecta a rota /usuarios
app.use('/user', user);
app.use('/category', category);
app.use('/item', item);
app.use('/order', order);
app.use('/orderItem', orderItem);
app.use('/address', address);

// Rota da documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Iniciar servidor
app.listen(3000, () => {
    console.log('Swagger disponível em http://localhost:3000/api-docs');
});