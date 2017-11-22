import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  Mutation: {
    async createProduct(_, { input: { promotionStart, promotionEnd, ...input } }, { database }) {
      return await database.Product.insert({
        ...input,
        promotion_start: promotionStart,
        promotion_end: promotionEnd,
      });
    },

    async editProduct(_, { input: { product, ...input } }, { database }) {
      await database.Product.update({ _id: product }, {
        $set: {
          ...input,
        },
      });
      return await database.Product.findOne({ _id: product });
    },

    async createOrderReceipt(_, { input: { numberOfItems, deliverAddress, paymentMethod, ...input } }, { database }) {
      return await database.Receipt.insert({
        ...input,
        number_of_items: numberOfItems,
        deliver_address: deliverAddress,
        payment_method: paymentMethod,
      });
    },

    async editOrderReceipt(_, { input: { receipt, ...input } }, { database }) {
      await database.Receipt.update({ _id: receipt }, {
        $set: {
          ...input,
        },
      });
      return await database.Receipt.findOne({ _id: receipt });
    },
  },
};

export default resolver;
