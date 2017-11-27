import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { database } from '../schema/models/index';

let subscriptionServer;

const addSubscriptions = (httpServer) => {
  const { Schema } = require('../schema');
  subscriptionServer = new SubscriptionServer({
    execute,
    subscribe,
    schema: Schema,
    onConnect(connectionParams, webSocket) {
      return {
        connectionParams,
        database,
      };
    },
  }, {
      server: httpServer,
      path: '/subscriptions',
    },
  );
};

const addGraphQLSubscriptions = (httpServer) => {
  if (module.hot && module.hot.data) {
    const prevServer = module.hot.data.subscriptionServer;
    if (prevServer && prevServer.wsServer) {
      // tslint:disable-next-line:no-console
      console.log('Reloading the subscription server.');

      prevServer.wsServer.close(() => {
        addSubscriptions(httpServer);
      });
    }
  } else {
    addSubscriptions(httpServer);
  }
};

if (module.hot) {
  module.hot.dispose((data) => {
    try {
      data.subscriptionServer = subscriptionServer;
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error.stack);
    }
  });
}

export {
  addGraphQLSubscriptions,
};
