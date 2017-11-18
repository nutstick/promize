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
    async addPicture(_, { product, pictures }, { database }) {
      await database.Product.update({ _id: product }, {
        $push: {
          picture: pictures,
        },
        $set: {
          updateAt: Date.now(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async addHashtag(_, { product, hashtags }, { database }) {
      await database.Product.update({ _id: product }, {
        $push: {
          hashtag: hashtags,
        },
        $set: {
          updateAt: Date.now(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async addSize(_, { product, size }, { database }) {
      await database.Product.update({ _id: product }, {
        $push: {
          sizes: size,
        },
        $set: {
          updateAt: Date.now(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async addColor(_, { product, color }, { database }) {
      await database.Product.update({ _id: product }, {
        $push: {
          colors: color,
        },
        $set: {
          updateAt: Date.now(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async removePicture(_, { product, pictures }, { database }) {
      await database.Product.update({ _id: product }, {
        $pull: {
          picture: pictures,
        },
        $set: {
          updateAt: Date.now(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async removeHashtag(_, { product, hashtags }, { database }) {
      await database.Product.update({ _id: product }, {
        $pull: {
          hashtag: hashtags,
        },
        $set: {
          updateAt: Date.now(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async removeColor(_, { product, color }, { database }) {
      await database.Product.update({ _id: product }, {
        $push: {
          colors: color,
        },
        $set: {
          updateAt: Date.now(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async removeSize(_, { product, size }, { database }) {
      await database.Product.update({ _id: product }, {
        $push: {
          sizes: size,
        },
        $set: {
          updateAt: Date.now(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },
    async createProduct(_, { input }, { database }) {
      return await database.Product.insert({
        ...input,
        promotion_start: input.promotionStart,
        promotion_end: input.promotionEnd,
      });
    },
  },
};

export default resolver;
