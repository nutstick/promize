import { ICategory, IColor, ISize } from '../../models/Product/productdetail';
import { IResolver } from '../index';

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

    async editSize(_, { product, sizes }, { database }) {
      await database.Product.update({ _id: product }, {
        $set: {
          sizes,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },

    async editColor(_, { product, colors }, { database }) {
      await database.Product.update({ _id: product }, {
        $set: {
          colors,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },

    async editCategory(_, { product, categories }, { database }) {
      await database.Product.update({ _id: product }, {
        $set: {
          categories,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },

    async createProduct(_, { input: { promotionStart, promotionEnd, ...input } }, { database }) {
      return await database.Product.insert({
        ...input,
        promotion_start: promotionStart,
        promotion_end: promotionEnd,
      });
    },
  },
};

export default resolver;
