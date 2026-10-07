const {getChannel} = require('./rabbitmq');

class EventPublisher {
    async publish(event){
        const channel = getChannel();

        const message = JSON.stringify(event);

        channel.publish(
            'order.events',
            '',
            Buffer.from(message),
            {
                persistent: true,
                contentType: 'application/json'
            }
        )
    }
}

module.exports = { EventPublisher };