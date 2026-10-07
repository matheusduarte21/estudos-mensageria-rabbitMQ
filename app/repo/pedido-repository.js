const { IPedidoRepository } = require('../interface/pedido-repository.interface');

class PedidoRepositoryPostgres extends IPedidoRepository {
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }

    async criar(data) {
        const {
            cliente,
            StatusPedido,
            enderecoEntrega,
            dataEntrega,
            items
        } = data;

        const valorTotal = items.reduce(
            (acc, item) => acc + item.quantidade * item.precoUnitario,
            0
        );

        return await this.prisma.pedido.create({
            data: {
                cliente,
                StatusPedido,
                enderecoEntrega,
                dataEntrega,
                valorTotal,

                items: {
                    create: items.map((item) => ({
                        produto: item.produto,
                        quantidade: item.quantidade,
                        precoUnitario: item.precoUnitario
                    }))
                }
            },

            include: {
                items: true
            }
        });
    }
}

module.exports = { PedidoRepositoryPostgres };