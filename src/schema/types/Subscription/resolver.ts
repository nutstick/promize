import { withFilter } from 'graphql-subscriptions';
import { IMessageDocument } from '../../models/Message';
import { ISubsciption } from '../index';
import { MESSAGE_ADDED, pubsub } from '../subscriptions';

const resolver: ISubsciption = {
  Subscription: {
    messageAdded: {
      resolve(message) {
        return message;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED),
        ({ traderoom }: IMessageDocument, args) => {
          return traderoom === args.traderoom;
        },
      ),
    },
  },
};

export default resolver;
