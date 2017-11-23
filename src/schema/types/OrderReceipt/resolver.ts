import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  OrderReceipt: {
    async deliverAddress({ buyer, deliver_address }, _, { database }) {
      const creator_data = await database.User.findOne({ _id: buyer });
      for (const i of creator_data.addresses) {
        if (i._id.toString() === deliver_address) {
          return i;
        }
      }
    },
    trackingId({ tracking_id }) {
      return tracking_id;
    },
    async paymentMethod({ buyer, payment_method }, _, { database }) {
      const creator_data = await database.User.findOne({ _id: buyer });
      for (const i of creator_data.payment_methods) {
        if (i._id.toString() === payment_method) {
          return i;
        }
      }
    },
    async color({ product, color }, _, { database }) {
      const product_data = await database.Product.findOne({ _id: product });
      for (const i of product_data.colors) {
        if (i._id.toString() === color) {
          return i;
        }
      }
    },
    async size({ product, size }, _, { database }) {
      const product_data = await database.Product.findOne({ _id: product });
      for (const i of product_data.sizes) {
        if (i._id.toString() === size) {
          return i;
        }
      }
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
    async creator({ buyer }, _, { database }) {
      return await database.User.findOne({ _id: buyer });
    },
  },
};

export default resolver;
