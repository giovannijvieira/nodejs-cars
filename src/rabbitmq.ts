import amqp from 'amqplib/callback_api';

const QUEUE_NAME = 'car_queue';

const connect = (): Promise<amqp.Connection> => {
  return new Promise((resolve, reject) => {
    amqp.connect('amqp://rabbitmq', (error: unknown, connection: amqp.Connection) => {
      if (error) {
        throw new Error('Erro ao conectar-se ao RabbitMQ: ' + (error as Error).message);
      }
      resolve(connection);
    });
  });
};

const sendToQueue = (connection: amqp.Connection, queueName: string, message: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    connection.createChannel((error: unknown, channel: amqp.Channel) => {
      if (error) {
        throw new Error('Erro ao criar o canal no RabbitMQ: ' + (error as Error).message);
      }

      channel.assertQueue(queueName, { durable: false });

      channel.sendToQueue(queueName, Buffer.from(message));
      console.log(`Mensagem enviada para a fila ${queueName}: ${message}`);

      resolve();
    });
  });
};

export { connect, sendToQueue, QUEUE_NAME };
