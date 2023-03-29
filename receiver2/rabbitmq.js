const amqp = require('amqplib');

async function receiver2() {
	try {

// Establish a connection with the RabbitMQ server
		const connection = await amqp.connect('amqp://localhost');
		const channel = await connection.createChannel();

// Declare the exchange and queue
		const exchangeName = 'my_exchange';
		const exchangeType = 'direct';
		await channel.assertExchange(exchangeName, exchangeType);
		const queueName = `my-queue`;
		await channel.assertQueue(queueName);

// Bind the queue to the exchange with the routing key
		const routingKey = 'my_routing_key';
		await channel.bindQueue(queueName, exchangeName, routingKey);

// Consume messages from the queue
		const processedMessages = new Set();
		console.log('processMessage', processedMessages)
		await channel.consume(queueName, (message) => {
			const messageId = message.properties.messageId;
			if (processedMessages.has(messageId)) {
				console.log(`Discarding duplicate message ${messageId}`);
			} else {
				console.log(`Processing message ${messageId}: ${message.content.toString()}`);
				processedMessages.add(messageId);
				channel.ack(message); // Acknowledge the message
			}
		});

	} catch (error) {
		console.error(error);
	}
}

module.exports = receiver2;