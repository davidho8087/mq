

const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

async function publisher (){
	try {
		const connection = await amqp.connect('amqp://localhost');
		const channel = await connection.createChannel();

// Declare the exchange
		const exchangeName = 'my_exchange';
		const exchangeType = 'direct';
		const routingKey = 'my_routing_key';
		await channel.assertExchange(exchangeName, exchangeType);

// Publish a message with a unique message ID
		const message = 'Hello World!';
		const messageId = uuidv4(); // Generate a unique message ID
		console.log(messageId)
		const messageOptions = { messageId };
		await channel.publish(exchangeName, routingKey, Buffer.from(message), messageOptions);

		console.log(`Message '${message}' sent to exchange '${exchangeName}' with routing key ${routingKey}`);

	} catch (error) {
		console.error(error);
	}
}

module.exports = publisher