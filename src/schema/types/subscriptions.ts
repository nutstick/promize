import { PubSub } from 'graphql-subscriptions';
import { IMessageDocument } from '../models/Message';

export const MESSAGE_ADDED = 'message_added';

export const pubsub = new PubSub();
