import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  OrderReceipt: {
    deliverAddress({ deliver_address }) {
      return deliver_address;
    },
    trackingId({ tracking_id }) {
      return tracking_id;
    },
    paymentMethod({ payment_method }) {
      return payment_method;
    },
    paymentCompletedAt({ payment_completed_at }) {
      return payment_completed_at;
    },
    paymentCompleted({ payment_completed }) {
      return payment_completed;
    },
    productDeliveredAt({ product_delivered_at }) {
      return product_delivered_at;
    },
    productDelivered({ product_delivered }) {
      return product_delivered;
    },
    productReceivedAt({ product_received_at }) {
      return product_received_at;
    },
    productReceived({ product_received }) {
      return product_received;
    },
    async product({ product }, _, { database }) {
      return await database.Product.findOne({ _id: product });
    },
    async creator({ creator }, _, { database }) {
      return await database.User.findOne({ _id: creator });
    },
  },
};

export default resolver;
