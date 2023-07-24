import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import { connect, ConnectOptions } from 'mongoose';
import Car, { ICar } from './models/Car';
import { connect as rabbitMQConnect, sendToQueue, QUEUE_NAME } from './rabbitmq';
import bodyParser from 'body-parser';

const amqp = require('amqplib');

const port: number = 3001;

const app = express();

mongoose.connect('mongodb://localhost:27018', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);


app.use(bodyParser.json());

interface ILog {
  id: string;
  data_hora: string;
  car_id: string;
}

const Log = mongoose.model<ILog>('Log', new mongoose.Schema({
  id: String,
  data_hora: String,
  car_id: String,
}));

function generateCustomID() {
  const characters = '0123456789abcdef';
  const idLength = 24;
  let customID = '';

  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    customID += characters[randomIndex];
  }

  return customID;
}

const newID = generateCustomID();


app.post('/api/createCar', async (req, res) => {
  try {
    const { title, brand, price, age } = req.body;

    if (!title || !brand || !price || !age) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const newCarData = {
      _id: generateCustomID(),
      title,
      brand,
      price,
      age,
      __v: 0,
    };

    try {
      const createCarResponse = await axios.post('http://api-test.bhut.com.br:3000/api/cars', newCarData);

      console.log('Corpo da requisição enviada:', newCarData);

      console.log('Retorno da API externa:', createCarResponse.data);

      if (createCarResponse.status === 200) {
        const createdCarData = createCarResponse.data;

        console.log(newCarData);
        const logData = {
          data_hora: new Date().toISOString(),
          car_id: createdCarData._id,
        };

        console.log(createdCarData);

        const createdLog = await Log.create(logData);

        const connection = await rabbitMQConnect();
        await sendToQueue(connection, QUEUE_NAME, JSON.stringify(createdCarData));

        res.json(createdCarData);
      } else {
        console.error('Erro na API externa:', createCarResponse.data);
        res.status(500).json({ error: 'Erro na API externa ao criar o carro.', apiError: createCarResponse.data });
      }
    } catch (error) {
      console.error('Erro ao criar o carro:', error);
      console.log('Erro detalhado:' +  error);
      res.status(500).json({ error: 'Erro ao criar o carro' });
    }
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    console.log('Erro detalhado:'+ error);
    res.status(500).json({ error: 'Erro ao processar a requisição' });
  }
});

const consumeQueueAndSendWebhook = async () => {
  try {
    const connection = await rabbitMQConnect();
    const channel = await connection.createChannel((error: any, channel: any) => {
      if (error) {
        throw new Error('Erro ao criar o canal no RabbitMQ: ' + error.message);
      }

      channel.assertQueue(QUEUE_NAME, { durable: false });

      console.log('Aguardando mensagens na fila...');

      channel.consume(
        QUEUE_NAME,
        async (message: any) => {
          if (message !== null) {
            const carData = JSON.parse(message.content.toString());
            console.log('Registro recebido da fila:', carData);

            try {
              await axios.post('http://172.17.0.2:3000/webhook/carro-cadastrado', carData);
              console.log('Webhook enviado com sucesso!');
            } catch (error) {
              console.error('Erro ao enviar o webhook:', error);
            }

            channel.ack(message);
          }
        },
        { noAck: false }
      );
    });
  } catch (error) {
    console.error('Erro ao consumir a fila:', error);
  }
};


consumeQueueAndSendWebhook();


app.get('/api/logs', async (req, res) => {
  try {
    const logs: ICar[] = await Log.find({});
    res.json(logs);
  } catch (error) {
    console.error('Erro ao buscar os logs:', error);
    res.status(500).json({ error: 'Erro ao buscar os logs' });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});


app.get('/api/listCars', async (req, res) => {
  try {
    const response = await axios.get('http://api-test.bhut.com.br:3000/api/cars');
    const carsData = response.data;
    res.json(carsData);
  } catch (error) {
    console.error('Erro ao obter os carros da API externa:', error);
    res.status(500).json({ error: 'Erro ao obter os carros' });
  }
});


