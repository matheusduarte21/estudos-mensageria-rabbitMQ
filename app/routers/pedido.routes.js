const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const { PedidoRepositoryPostgres } = require('../repo/pedido-repository');
const { PedidoService } = require('../services/Pedido/PedidoService');
const { PedidoController } = require('../controllers/pedido.controller');
const { EventPublisher } = require('../messaging/event.publisher');

const routes = Router();

const prisma = new PrismaClient();

const pedidoRepository = new PedidoRepositoryPostgres(prisma);

const eventPublisher = new EventPublisher();

const pedidoService = new PedidoService(
    pedidoRepository,
    eventPublisher
);

const pedidoController = new PedidoController(
    pedidoService
);

routes.post('/pedidos', (req, res) => {
    pedidoController.criar(req, res);
});

module.exports = routes;