const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
    const connection = await amqp.connect(
        process.env.RABBITMQ_URL
    );

    channel = await connection.createChannel();

    await channel.assertExchange(
        'order.events',
        'fanout',
        {
            durable: true
        }
    );

    await channel.assertQueue(
        'payment.retry.queue',
        {
            durable: true,

            arguments: {
                'x-message-ttl': 5000,

                'x-dead-letter-exchange': '',

                'x-dead-letter-routing-key': 'payment.queue'
            }
        }
    );

    await channel.assertQueue(
        'payment.dlq',
        {
            durable: true
        }
    );

    await channel.assertQueue('inventory.queue', {
        durable: true
    });

    await channel.assertQueue('shipping.queue', {
        durable: true
    });

    await channel.bindQueue(
        'payment.queue',
        'order.events',
        ''
    );

    await channel.bindQueue(
        'inventory.queue',
        'order.events',
        ''
    );

    await channel.bindQueue(
        'shipping.queue',
        'order.events',
        ''
    );

    console.log('RabbitMQ configurado');
}

function getChannel() {
    if (!channel) {
        throw new Error('RabbitMQ ainda não foi conectado');
    }

    return channel;
}

module.exports = {
    connectRabbitMQ,
    getChannel
};