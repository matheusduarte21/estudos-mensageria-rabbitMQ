const crypto = require('crypto');
const { EventType } = require('../types/eventType');

function createOrderCreatedEvent(pedido) {
    return {
        eventId: crypto.randomUUID(),
        eventType: EventType.ORDER_CREATED,
        occurredAt: new Date().toISOString(),
        version: 1,

        data: {
            orderId: pedido.id,
            cliente: pedido.cliente,
            total: pedido.valorTotal,
            enderecoEntrega: pedido.enderecoEntrega,

            items: pedido.items.map((item) => ({
                produto: item.produto,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario
            }))
        }
    };
}

module.exports = { createOrderCreatedEvent };