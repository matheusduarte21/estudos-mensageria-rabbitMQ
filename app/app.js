const express = require('express');
const pedidoRoutes = require('./routers/pedido.routes'); 

const app = express();

app.use(express.json()); 

app.use(pedidoRoutes); 

module.exports = app;