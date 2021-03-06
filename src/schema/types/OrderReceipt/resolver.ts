import { toObjectID } from 'iridium';
import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  OrderReceiptEdges: {
  },
  OrderReceipt: {
    async deliverAddress({ buyer, deliver_address }, _, { database }) {
      const creator_data = await database.User.findOne({ _id: buyer });
      for (const i of creator_data.addresses) {
        if (i._id.toString() === deliver_address) {
          return i;
        }
      }
      return null;
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
      return null;
    },
    async color({ product, color }, _, { database }) {
      const product_data = await database.Product.findOne({ _id: product });
      for (const i of product_data.colors) {
        if (i._id.toString() === color) {
          return i;
        }
      }
      return null;
    },
    async size({ product, size }, _, { database }) {
      const product_data = await database.Product.findOne({ _id: product });
      for (const i of product_data.sizes) {
        if (i._id.toString() === size) {
          return i;
        }
      }
      return null;
    },
    async creator({ buyer }, _, { database }) {
      return await database.User.findOne({ _id: toObjectID(buyer) });
    },
    status({ payment_completed, product_delivered, product_received }) {
      return payment_completed ? 'PAID' : product_delivered ? 'DELIVERED' : product_received ?
        'RECEIVED' : 'CREATED';
    },
    paymentCompletedAt({ payment_completed_at }) {
      return payment_completed_at;
    },
    productDeliveredAt({ product_delivered_at }) {
      return product_delivered_at;
    },
    productReceivedAt({ product_received_at }) {
      return product_received_at;
    },
    async product({ product }, _, { database }) {
      return await database.Product.findOne({ _id: product });
    },
  },
};

export default resolver;
