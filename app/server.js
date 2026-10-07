require('dotenv').config();

const http = require('http');
const app = require('./app');
const { connectRabbitMQ } = require('./messaging/rabbitmq');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    try {
        await connectRabbitMQ();

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Erro ao iniciar aplicação:', error);
        process.exit(1);
    }
}

startServer();