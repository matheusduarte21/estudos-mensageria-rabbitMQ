require('dotenv').config();

const amqp = require('amqplib');

const MAX_RETRIES = 3;

const PAYMENT_QUEUE = 'payment.queue';
const PAYMENT_RETRY_QUEUE = 'payment.retry.queue';
const PAYMENT_DLQ = 'payment.dlq';

async function processPayment(event) {
    console.log('---------------------------');
    console.log('Processando pagamento');

    console.log(`Pedido: ${event.data.orderId}`);
    console.log(`Cliente: ${event.data.cliente}`);
    console.log(`Valor: R$ ${event.data.total}`);

    console.log('Pagamento processado');
    console.log('---------------------------');
}


function getRetryCount(msg) {
    return msg.properties.headers?.['x-retry-count'] || 0;
}


function sendToRetry(channel, msg) {
    const retryCount = getRetryCount(msg);

    channel.sendToQueue(
        PAYMENT_RETRY_QUEUE,
        msg.content,
        {
            persistent: true,
            contentType: 'application/json',

            headers: {
                ...msg.properties.headers,

                'x-retry-count': retryCount + 1
            }
        }
    );
}

function sendToDlq(channel, msg, error) {
    channel.sendToQueue(
        PAYMENT_DLQ,
        msg.content,
        {
            persistent: true,
            contentType: 'application/json',

            headers: {
                ...msg.properties.headers,

                'x-error-message': error.message,
                'x-failed-at': new Date().toISOString()
            }
        }
    );
}


async function handleFailure(channel, msg, error) {
    const retryCount = getRetryCount(msg);

    if (retryCount < MAX_RETRIES) {
        console.log(
            `Falha no processamento. Retry ${retryCount + 1}/${MAX_RETRIES}`
        );

        sendToRetry(channel, msg);
        channel.ack(msg);

        return;
    }

    console.log(
        `Máximo de retries atingido (${MAX_RETRIES}).`
    );

    console.log(
        'Enviando mensagem para payment.dlq...'
    );

    sendToDlq(channel, msg, error);

    channel.ack(msg);
}


async function startPaymentWorker() {
    try {
        const connection = await amqp.connect(
            process.env.RABBITMQ_URL
        );

        const channel = await connection.createChannel();

        await channel.assertQueue(
            PAYMENT_QUEUE,
            {
                durable: true
            }
        );

        await channel.assertQueue(
            PAYMENT_RETRY_QUEUE,
            {
                durable: true,

                arguments: {

                    'x-message-ttl': 5000,
                    'x-dead-letter-exchange': '',
                    'x-dead-letter-routing-key':
                        PAYMENT_QUEUE
                }
            }
        );

        await channel.assertQueue(
            PAYMENT_DLQ,
            {
                durable: true
            }
        );


        channel.prefetch(1);


        console.log(
            'PaymentWorker aguardando mensagens...'
        );

        channel.consume(
            PAYMENT_QUEUE,

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
                        `\nEvento recebido: ${event.eventType}`
                    );

                    console.log(
                        `Tentativa: ${getRetryCount(msg) + 1}`
                    );


                    await processPayment(event);


                    channel.ack(msg);


                    console.log(
                        'ACK enviado ao RabbitMQ.'
                    );

                } catch (error) {

                    console.error(
                        'Erro no PaymentWorker:',
                        error.message
                    );


                    await handleFailure(
                        channel,
                        msg,
                        error
                    );
                }
            },

            {
                noAck: false
            }
        );

    } catch (error) {
        console.error(
            'Erro ao iniciar PaymentWorker:',
            error
        );

        process.exit(1);
    }
}


startPaymentWorker();


module.exports = {
    startPaymentWorker,
    getRetryCount,
    sendToRetry,
    sendToDlq,
    handleFailure
};