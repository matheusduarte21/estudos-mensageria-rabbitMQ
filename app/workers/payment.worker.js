require('dotenv').config();

const amqp = require('amqplib');

async function processPayment(event) {
    console.log('---------------------------');
    console.log('Processando pagamento');

    console.log(`Pedido: ${event.data.orderId}`);
    console.log(`Cliente: ${event.data.cliente}`);
    console.log(`Valor: R$ ${event.data.total}`);

    console.log('Pagamento processado');
    console.log('---------------------------');
}

async function startPaymentWorker() {
    const connection = await amqp.connect(
        process.env.RABBITMQ_URL
    );

    const channel = await connection.createChannel();

    await channel.assertQueue(
        'payment.queue',
        {
            durable: true
        }
    );

    console.log(
        'PaymentWorker aguardando mensagens...'
    );

    channel.consume(
        'payment.queue',

        async (msg) => {
            if (!msg) {
                return;
            }

            try {
                const content =
                    msg.content.toString();

                const event =
                    JSON.parse(content);

                console.log(
                    'Evento recebido:',
                    event.eventType
                );

                await processPayment(event);

                channel.ack(msg);

            } catch (error) {
                console.error(
                    'Erro no PaymentWorker:',
                    error
                );

                channel.nack(
                    msg,
                    false,
                    false
                );
            }
        },

        {
            noAck: false
        }
    );
}

startPaymentWorker();