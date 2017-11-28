import { execute, subscribe } from 'graphql';
import * as http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { wsport } from './config';
import { Schema } from './schema';
import { database } from './schema/models/index';

let server;

if (!__DEV__) {
  console.warn('SETUP TLS FOR PRODUCTION IN WEBSOCKET'); // eslint-disable-line
}

if (!server) {
  server = http.createServer((req, res) => {
    res.writeHead(400);
    res.end();
  });

  server.listen(wsport, () => {
    // tslint:disable-next-line:no-console
    console.info(`Websocket server is running at http://localhost:${wsport}/`);

    SubscriptionServer.create({
      schema: Schema,
      execute,
      subscribe,
      onConnect(connectionParams, webSocket) {
        return {
          connectionParams,
          database,
        };
      },
      async onOperation(msg, params, socket) {
        return new Promise((resolve) => {
          const query = params.query;
          if (query && query.length > 2000) {
            throw new Error('Query too long');
          }
        });
      },
    }, {
      server,
      path: '/subscriptions',
    });
  });
}

export default server;
