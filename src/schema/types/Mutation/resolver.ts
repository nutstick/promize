import { IResolver } from '../index';
import { log } from 'util';

const resolver: IResolver<any, any> = {
  Mutation: {
    async createProduct(_, { input: { promotionStart, promotionEnd, price, ...input } }, { database, user }) {
      return await database.Product.insert({
        ...input,
        promotion_start: promotionStart,
        promotion_end: promotionEnd,
        owner: user._id,

      });
    },

    async editProduct(_, { input: { product, ...input } }, { database }) {
      database.Product.findOne({ _id: product }).then(async (instance) => {
        await database.Product.update({ _id: instance._id },
          {
            $set: {
              ...input,
            },
          });
      });
      return await database.Product.findOne({ _id: product });
    },

    async createOrderReceipt(_, { input: { deliverAddress, paymentMethod, ...input } }, { database, user }) {
      if (database.User.find({ _id: user._id, payment_method: { _id: paymentMethod } })) {
        input.payment_method = paymentMethod;
      } else {
        throw new Error(`Invalid paymentMethod ID`);
      }
      if (database.User.find({ _id: user._id, deliver_address: { _id: deliverAddress } })) {
        input.deliver_address = deliverAddress;
      } else {
        throw new Error(`Invalid deliverAddress ID`);
      }
      return await database.Receipt.insert({
        ...input,
        buyer: user._id,
      });
    },

    // tslint:disable-next-line:max-line-length
    async editOrderReceipt(_, { input: { receipt, paymentCompleted, productDelivered, productReceived, ...input } }, { database }) {
      database.Receipt.findOne({ _id: receipt }).then(async (instance) => {
        if ((paymentCompleted === true) && (instance.payment_completed === false)) {
          input.paymentCompletedAt = new Date();
        } else {
          throw new Error(`Invalid change in paymentMethodCompleted`);
        }
        if ((productDelivered === true) && (instance.product_delivered === false)) {
          input.productDeliveredAt = new Date();
        } else {
          throw new Error(`Invalid change in productDelivered`);
        }
        if ((productReceived === true) && (instance.product_received === false)) {
          input.productReceivedAt = new Date();
        } else {
          throw new Error(`Invalid change in productReceived`);
        }
        await database.Receipt.update({ _id: instance._id }, {
          $set: {
            ...input,
          },
        });
        return await database.Receipt.findOne({ _id: receipt });
      });
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
