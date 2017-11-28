import { createWriteStream } from 'fs';
import * as mkdirp from 'mkdirp';
import * as shortid from 'shortid';
import { uploadDir } from '../../../config';
import { IResolver } from '../index';
import { MESSAGE_ADDED, pubsub } from '../subscriptions';

// Ensure upload directory exists
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename }) => {
  const id = shortid.generate();
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise<{ id: string, path: string }>((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path: `/${path.split('/').slice(2).join('/')}` }))
      .on('error', reject),
  );
};

const processUpload = async (upload) => {
  const { stream, filename } = await upload;
  return await storeUpload({ stream, filename });
};

const resolver: IResolver<any, any> = {
  Mutation: {

    // async uploadFile(root, { file }, { database }) {
    //   console.log(root);
    //   return true;
    // },

    // tslint:disable-next-line:max-line-length
    async createProduct(_, { input: { promotionStart, promotionEnd, pictures, price, ...input } }, { database, user }) {
      const picturesUrl = await Promise.all((pictures as Array<Promise<any>>).map(processUpload));
      const userInstance = await database.User.findOne({ _id: user._id });
      // Only CoSeller can create product
      if (userInstance.type === 'CoSeller') {
        return await database.Product.insert({
          ...input,
          pictures: picturesUrl.map((picture) => {
            return picture.path.slice(1);
          }),
          promotion_start: promotionStart,
          promotion_end: promotionEnd,
          owner: user._id,
        });
      } else {
        throw new Error(`You must be CoSeller to create product`);
      }
    },

    async editProduct(_, { input: { id, ...input } }, { database, user }) {
      const userInstance = await database.User.findOne({ _id: user._id });
      const productInstance = await database.Product.findOne({ _id: id });
      // Only owner can edit
      if (userInstance.type === 'CoSeller' && productInstance.owner === user._id) {
        // FIXME: Cant merge fields like originalPrice, promotionStart convert to camel case first
        await database.Product.update({ _id: id }, {
          $set: {
            ...input,
          },
        });
      } else {
        throw new Error(`You must be Product Owner to edit product`);
      }
      return await database.Product.findOne({ _id: id });
    },

    async createOrderReceipt(_, { input: { deliverAddress, paymentMethod, ...input } }, { database, user }) {
      // FIXME: Cant merge fields like convert to camel case first
      const userInstance = await database.User.findOne({ _id: user._id });
      if (paymentMethod._id) {
        if (database.User.find({ _id: user._id, payment_method: { _id: paymentMethod._id } })) {
          input.payment_method = paymentMethod._id;
        } else {
          throw new Error(`Invalid paymentMethod ID`);
        }
      } else {
        const id = userInstance.addPaymentMethod({
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
        const id = userInstance.addAddress(deliverAddress);
        input.deliver_address = id.toString();
      }

      await userInstance.save();

      return await database.Receipt.insert({
        ...input,
        buyer: user._id,
      });
    },

    async editOrderReceipt(
      _,
      { input: { id, status } },
      { database },
    ) {
      const orederReceipt = await database.Receipt.findOne({ _id: id });
      const update: any = {};
      if (status === 'PAID' && orederReceipt.payment_completed === false) {
        update.payment_completed = true;
        update.payment_completed_at = new Date();
      } else {
        throw new Error(`Invalid change in paymentMethodCompleted`);
      }
      if (status === 'DELIVERED' === true && orederReceipt.product_delivered === false) {
        update.product_delivered = true;
        update.product_delivered_at = new Date();
      } else {
        throw new Error(`Invalid change in productDelivered`);
      }
      if (status === 'RECEIVED' && orederReceipt.product_received === false) {
        update.product_received = true;
        update.product_received_at = new Date();
      } else {
        throw new Error(`Invalid change in productReceived`);
      }

      await database.Receipt.update({ _id: id }, {
        $set: {
          ...update,
        },
      });

      return await database.Receipt.findOne({ _id: id });
    },

    async addAddress(_, { address }, { database, user }) {
      if (user && user._id) {
        const userInstance = await database.User.findOne({ _id: user._id });
        userInstance.addAddress(address);
        userInstance.save();
        return userInstance;
      }
      return null;
    },

    async editAddress(_, { address }, { database, user }) {
      if (user && user._id) {
        const userInstance = await database.User.findOne({ _id: user._id });
        userInstance.save();
        return userInstance;
      }
      return null;
    },

    async addPaymentMethod(_, { paymentMethod }, { database, user }) {
      if (user && user._id) {
        const userInstance = await database.User.findOne({ _id: user._id });
        userInstance.addPaymentMethod({
          credit_card_number: paymentMethod.creditCardNumber,
          valid_from_month: paymentMethod.validFromMonth,
          valid_from_year: paymentMethod.validFromYear,
        });
        userInstance.save();
        return userInstance;
      }
      return null;
    },

    async editPaymentMethod(_, { paymentMethod }, { database, user }) {
      if (user && user._id) {
        const userInstance = await database.User.findOne({ _id: user._id });
        userInstance.editPaymentMethod({
          _id: paymentMethod._id,
          credit_card_number: paymentMethod.creditCardNumber,
          valid_from_month: paymentMethod.validFromMonth,
          valid_from_year: paymentMethod.validFromYear,
        });
        userInstance.save();
        return userInstance;
      }
      return null;
    },

    async registerToBeCoSeller(_, { input }, { database, user }) {
      const citizenCardImageUrl = await processUpload(input.citizenCardImage);

      const userInstance = await database.User.findOne({ _id: user._id });
      if (userInstance.type === 'User') {
        await database.User.update({ _id: user._id }, {
          $set: {
            tel_number: input.telNumber ? input.telNumber : userInstance.telNumber,
            citizen_card_image: citizenCardImageUrl.path.slice(1),
            coseller_register_status: 'Pending',
          },
        });
        return await database.User.findOne({ _id: user._id });
      } else {
        throw new Error(`This account have been Co-seller already`);
      }
    },

    async approveUserToCoseller(_, { user_id }, { database, user }) {
      const userInstance = await database.User.findOne({ _id: user._id });
      if (userInstance.type === 'Admin') {
        await database.User.update({ _id: user_id }, {
          $set: {
            type: 'CoSeller',
            coseller_register_status: 'Approved',
          },
        });
        return await database.User.findOne({ _id: user_id });
      } else {
        throw new Error(`You must be Admin for approve other people`);
      }
    },

    async createUser(
      _,
      { input: { firstName, middleName, lastName, telNumber, paymentMethods, ...input } },
      { database },
    ) {
      return await database.User.insert({
        ...input,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        tel_number: telNumber,
        payment_methods: paymentMethods,
      });
    },

    async editUser(
      _,
      {
        input: {
          firstName, middleName, lastName, gender, telNumber, password, avatar,
        },
      },
      { database, user },
    ) {
      const userInstance = await database.User.findOne({ _id: user._id });
      await database.User.update({ _id: user._id }, {
        $set: {
          first_name: firstName ? firstName : userInstance.first_name,
          middle_name: middleName ? middleName : userInstance.middle_name,
          last_name: lastName ? lastName : userInstance.last_name,
          tel_number: telNumber ? telNumber : userInstance.tel_number,
          gender: gender ? gender : userInstance.gender,
          avatar: avatar ? avatar : userInstance.avatar,
        },
      });
      return await database.User.findOne({ _id: user._id });
    },

    async createTradeRoom(_, { input }, { database, user }) {
      return await database.Traderoom.insert({
        ...input,
      });
    },

    async editTradeRoom(_, { input: { id, ...input } }, { database, user }) {
      return await database.Traderoom.update({ _id: id }, {
        ...input,
      });
    },

    async confirmBuyInTradeRoom(_, { id }, { database, user }) {
      return await database.Traderoom.update({ _id: id }, {
        $set: {
          buy_confirm: true,
          buy_confirm_at: new Date(),
        },
      });
    },

    async addMessage(_, { content, traderoom }, { database, user }) {
      const message = await database.Message.create({
        traderoom,
        content,
        owner: user._id,
      });

      if (content.text) {
        pubsub.publish(MESSAGE_ADDED, message);
      } else if (content.command) {
        switch (content.command) {
          case 'color': {
            database.Traderoom.update({ _id: traderoom }, {
              $set: { color: content.arguments[0] },
            });
          }
          case 'size': {
            database.Traderoom.update({ _id: traderoom }, {
              $set: { size: content.arguments[0] },
            });
          }
          case 'price': {
            database.Traderoom.update({ _id: traderoom }, {
              $set: { price: content.arguments[0] },
            });
          }
        }
      }
      return message;
    },
  },
};

export default resolver;
