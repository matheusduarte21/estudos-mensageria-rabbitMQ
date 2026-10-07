class PedidoController {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }

    async criar(req, res) {
        try {
            const pedido = await this.pedidoService.criar(req.body);

            return res.status(201).json(pedido);
        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    }
}

module.exports = { PedidoController };