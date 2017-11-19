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
      if (sizes) {
        for (const s of sizes) {
          const size = s.size;
          const size_product = await database.Product.findOne({
            'sizes.size': size,
          });
          for (const p of size_product.sizes) {
            if (p.size === s.size) {
              s._id = p._id;
            }
          }
        }
      } else {
        sizes = [];
      }
      await database.Product.update({ _id: product }, {
        $set: {
          sizes,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },

    async editColor(_, { product, colors }, { database }) {
      if (colors) {
        for (const c of colors) {
          const color = c.color;
          const color_product = await database.Product.findOne({
            'colors.color': color,
          });
          for (const p of color_product.colors) {
            if (p.color === c.color) {
              c._id = p._id;
            }
          }
        }
      } else {
        colors = [];
      }
      await database.Product.update({ _id: product }, {
        $set: {
          colors,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },

    async createProduct(_, { input: { promotionStart, promotionEnd, colors, sizes, ...input } }, { database }) {

      if (colors) {
        for (const c of colors) {
          const color = c.color;
          const color_product = await database.Product.findOne({
            'colors.color': color,
          });
          for (const p of color_product.colors) {
            if (p.color === c.color) {
              c._id = p._id;
            }
          }
        }
      } else {
        colors = [];
      }

      if (sizes) {
        for (const s of sizes) {
          const size = s.size;
          const size_product = await database.Product.findOne({
            'sizes.size': size,
          });
          for (const p of size_product.sizes) {
            if (p.size === s.size) {
              s._id = p._id;
            }
          }
        }
      } else {
        sizes = [];
      }

      return await database.Product.insert({
        ...input,
        sizes,
        colors,
        promotion_start: promotionStart,
        promotion_end: promotionEnd,
      });
    },
  },
};

export default resolver;
