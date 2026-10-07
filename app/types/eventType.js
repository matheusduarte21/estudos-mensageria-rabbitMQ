const EventType = Object.freeze({
    ORDER_CREATED: 'OrderCreated',
    ORDER_PAID: 'OrderPaid',
    ORDER_PAYMENT_FAILED: 'OrderPaymentFailed',
    STOCK_RESERVED: 'StockReserved',
    OUT_OF_STOCK: 'OutOfStock',
    ORDER_SHIPPED: 'OrderShipped'
});

module.exports = { EventType };