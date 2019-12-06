require('dotenv').config();

const express = require('express');
const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const OutboxRoutes = require('./services/outbox').routes;

const broker = new ServiceBroker({
  logger: console
});

broker.loadServices('services', '*.js');

const routerService = broker.createService({
  mixins: ApiGatewayService,
  settings: {
    middleware: true,
    routes: [OutboxRoutes]
  }
});

const app = express();
app.use(routerService.express());

app.listen(3000, err => {
  if (err) return console.error(err);
  console.log('Listening on http://localhost:3000');
});

broker.start();
