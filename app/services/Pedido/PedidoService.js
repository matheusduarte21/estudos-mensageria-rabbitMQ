const { createOrderCreatedEvent } = require('../../events/order-created.event');

class PedidoService {
    constructor(pedidoRepository, eventPublisher) {
        this.pedidoRepository = pedidoRepository;
        this.eventPublisher = eventPublisher;
    }

    async criar(data) {
        const pedido = await this.pedidoRepository.criar(data);
        const event = createOrderCreatedEvent(pedido);
        this.eventPublisher.publish(event);

        return pedido;
    }
}

module.exports = { PedidoService };