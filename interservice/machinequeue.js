const amqp = require('amqplib');

const mqSend = async (message, queue, correlationId) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.sendToQueue(queue, Buffer.from(message), { correlationId });
  console.log(`sent ${message} to queue ${queue}`);
  await channel.close();
  await connection.close();
};

const registerReceiver = async (queueName, receiver) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const ok = await channel.assertQueue(queueName, { durable: false });
  if (ok) {
    channel.consume(queueName, (message) => {
      console.log(` Received ${message.content.toString()}`);
      receiver(message);
      channel.ack(message);
    });
    console.log('Waiting for messages.');
  }
};

module.exports = { mqSend, registerReceiver };
