# Test Back Node.js

Este é um projeto de back-end em Node.js.

## Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados em sua máquina.

Também é necessário ter um servidor MongoDB em execução localmente ou fornecer uma URL de conexão válida para um servidor MongoDB remoto.
É necessário ter instalado Docker e Docker-compose, para execução dos containers.

## Configuração do MongoDB

No arquivo `index.ts`, você pode definir a URL de conexão do MongoDB. Por padrão, a URL de conexão é definida para `mongodb://localhost:27017/test`.

Se você estiver usando um servidor MongoDB localmente, certifique-se de que ele esteja em execução antes de iniciar a aplicação.

Se estiver usando um servidor MongoDB remoto, substitua a URL de conexão pelo URL fornecido pelo provedor de hospedagem do MongoDB.

## Configuração do RabbitMQ

No arquivo `rabbitmq.ts`, você pode definir a URL de conexão do RabbitMQ. Por padrão, a URL de conexão é definida para `amqp://localhost`.

Se você estiver usando o RabbitMQ localmente, certifique-se de que o Docker esteja em execução e execute o seguinte comando para iniciar o servidor RabbitMQ em um contêiner.

Isso criará um contêiner do RabbitMQ e o executará localmente na porta padrão 5672.

Se estiver usando o RabbitMQ remoto, substitua a URL de conexão pelo URL fornecido pelo provedor de hospedagem do RabbitMQ.

## Como executar a aplicação

1. Clone este repositório.
2. Navegue até o diretório do projeto.
3. Execute o seguinte comando para instalar as dependências:

*npm install*


4. Em seguida, inicie os serviços do Docker para MongoDB e RabbitMQ:

*docker-compose up*

## Configuração do Webhook

5. Em outro terminal, navegue até o diretório do projeto webhook, que está disponível no link a seguir, e siga as instruções para executá-lo:

[https://github.com/seu-usuario/projeto-webhook](https://github.com/seu-usuario/projeto-webhook)

6. Retorne ao terminal anterior e execute a aplicação:

*npm run build*

>>>>>>>>>>>>>>>>

*npm start*


A aplicação estará em execução na porta 3001.

7. Para parar a aplicação, pressione `Ctrl + C` no terminal.

Lembre-se de que o servidor MongoDB, RabbitMQ e o projeto webhook devem estar em execução antes de iniciar a aplicação.

Se você optar por usar um servidor MongoDB e RabbitMQ em contêineres Docker, verifique se o Docker está em execução e execute os comandos `docker-compose up` antes de iniciar a aplicação.

Se você optar por usar servidores MongoDB e RabbitMQ remotos, certifique-se de fornecer as URLs de conexão corretas nos arquivos `index.ts` e `rabbitmq.ts`.

## Coleção do Insomnia

A coleção do Insomnia, contendo as requisições de exemplo para testar a API, está disponível na pasta "docs". Você pode importar essa coleção para o Insomnia e utilizá-la para testar a API localmente.



