import { IResolver } from '../index';
// tslint:disable-next-line:no-var-requires
const m = require('casual');

const resolver: IResolver<any, any> = {
  Mutation: {
    async editPrice(_, { product, price }, { database }) {
      await database.Product.update({ _id: product }, {
        $set: {
          price,
          updateAt: Date.now(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async editPicture(_, { product, pictures }, { database }) {
      await database.Product.update({ _id: product }, {
        $set: {
          picture: pictures,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async editHashtag(_, { product, hashtags }, { database }) {
      await database.Product.update({ _id: product }, {
        $set: {
          hashtag: hashtags,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async editSize(_, { product, size }, { database }) {
      await database.Product.update({ _id: product }, {
        $set: {
          sizes: size,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async editColor(_, { product, color }, { database }) {
      await database.Product.update({ _id: product }, {
        $set: {
          colors: color,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async createProduct(_, { input: { promotionStart, promotionEnd, ...input} }, { database }) {
      return await database.Product.insert({
        ...input,
        promotion_start: promotionStart,
        promotion_end: promotionEnd,
      });
    },
  },
};

export default resolver;
