/**
 * @typedef {import('@prisma/client').Pedido} Pedido
 * @typedef {import('@prisma/client').PedidoItem} PedidoItem
 * @typedef {Pedido & { items: PedidoItem[] }} PedidoComItens
 */

/**
 * @interface IPedidoRepository
 */
class IPedidoRepository {
    /**
     * @param {Object} data
     * @param {string} data.cliente
     * @param {string} data.StatusPedido
     * @param {string} data.enderecoEntrega
     * @param {Date} data.dataEntrega
     * @param {Array<{ produto: string; quantidade: number; precoUnitario: number }>} data.items
     * @returns {Promise<PedidoComItens>}
     */
    async criar(data) {
        throw new Error("Método 'criar' não implementado.");
    }

    /**
     * @param {number} id
     * @returns {Promise<PedidoComItens | null>}
     */
    async buscarPorId(id) {
        throw new Error("Método 'buscarPorId' não implementado.");
    }
}

module.exports = { IPedidoRepository };