import { IResolver } from '../index';

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
      const user_out = await database.User.findOne({ _id: user._id });
      if (paymentMethod._id) {
        if (database.User.find({ _id: user._id, payment_method: { _id: paymentMethod._id } })) {
          input.payment_method = paymentMethod._id;
        } else {
          throw new Error(`Invalid paymentMethod ID`);
        }
      } else {
        const id = user_out.addPaymentMethod({
          credit_card_number: paymentMethod.creditCardNumber,
          valid_from_month: paymentMethod.validFromMonth,
          valid_from_year: paymentMethod.validFromYear,
        });
        input.payment_method = id.toString();
      }

      if (deliverAddress._id) {
        if (database.User.find({ _id: user._id, deliver_address: { _id: deliverAddress._id } })) {
          input.deliver_address = deliverAddress._id;
        } else {
          throw new Error(`Invalid deliverAddress ID`);
        }
      } else {
        const id = user_out.addAddress(deliverAddress);
        input.deliver_address = id.toString();
      }
      user_out.save();

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
        const user_out = await database.User.findOne({ _id: user._id });
        user_out.addAddress(address);
        user_out.save();
        return user_out;
      }
      return null;
    },

    async addPaymentMethod(_, { paymentMethod }, { database, user }) {
      if (user && user._id) {
        const user_out = await database.User.findOne({ _id: user._id });
        user_out.addPaymentMethod({
          credit_card_number: paymentMethod.creditCardNumber,
          valid_from_month: paymentMethod.validFromMonth,
          valid_from_year: paymentMethod.validFromYear,
        });
        user_out.save();
        return user_out;
      }
      return null;
    },
  },
};

export default resolver;
