export const amqpClientOptions = {
  urls: [process.env.RABBITMQ_CONNECTION_URL],
  queue: process.env.AMQP_QUEUE,
  queueOptions: {
    durable: false,
  },
};
