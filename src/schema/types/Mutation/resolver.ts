import { IResolver } from '../index';
import { log } from 'util';

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

    async addAddress(_, { address }, { database, user }) {
      if (user && user._id) {
        await database.User.update({ _id: user._id }, { $push: { addresses: address } });
        return await database.User.findOne({ _id: user._id });
      }
      return null;
    },

    async addPaymentMethod(_, { paymentMethod }, { database, user }) {
      console.log(paymentMethod);
      if (user && user._id) {
        await database.User.update({ _id: user._id }, {
          $push: {
            payment_methods: {
              credit_card_number: paymentMethod.creditCardNumber,
              valid_from_month: paymentMethod.validFromMonth,
              valid_from_year: paymentMethod.validFromYear,
            },
          },
        });
        return await database.User.findOne({ _id: user._id });
      }
      return null;
    },
  },
};

export default resolver;
