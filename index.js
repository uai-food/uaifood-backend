const express = require('express');
const app = express();
const user = require('./src/routes/user'); //importa o arquivo usuarios.js
const category = require('./src/routes/category');
const item = require('./src/routes/item');
const order = require('./src/routes/order');
const orderItem = require('./src/routes/orderItem');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./configs/swaggerConfig');
require('dotenv').config();

app.use(express.json());

// Conecta a rota /usuarios
app.use('/user', user);
app.use('/category', category);
app.use('/item', item);
app.use('/order', order);
app.use('/orderItem', orderItem);

// Rota da documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Iniciar servidor
app.listen(3000, () => {
    console.log('Swagger disponível em http://localhost:3000/api-docs');
});