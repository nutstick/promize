import { ICategory, IColor, ISize } from '../../models/Product/productdetail';
import { IResolver } from '../index';

async function AddColorID(colors: IColor[], database) {
  if (colors) {
    for (const c of colors) {
      const color = c.color;
      const color_product = await database.Product.findOne({
        'colors.color': color,
      });
      if (color_product) {
        for (const p of color_product.colors) {
          if (p.color === c.color) {
            c._id = p._id;
          }
        }
      }
    }
  } else {
    colors = [];
  }
  return colors;
}

async function AddSizeID(sizes: ISize[], database) {
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
  return sizes;
}

async function AddCategoryID(categories: ICategory[], database) {
  if (categories) {
    for (const s of categories) {
      const category = s.category;
      const category_product = await database.Product.findOne({
        'categories.category': category,
      });
      for (const p of category_product.categories) {
        if (p.category === s.category) {
          s._id = p._id;
        }
      }
    }
  } else {
    categories = [];
  }
  return categories;
}

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
      sizes = AddSizeID(sizes, database);
      await database.Product.update({ _id: product }, {
        $set: {
          sizes,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },

    async editColor(_, { product, colors }, { database }) {
      colors = AddColorID(colors, database);
      await database.Product.update({ _id: product }, {
        $set: {
          colors,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },

    async editCategory(_, { product, categories }, { database }) {
      categories = AddCategoryID(categories, database);
      await database.Product.update({ _id: product }, {
        $set: {
          categories,
          updateAt: new Date(),
        },
      });
      return await database.Product.findOne({ _id: product });
    },

    async createProduct(
      _, { input: { promotionStart, promotionEnd, colors, sizes, categories, ...input } }, { database }
    ) {
      colors = await AddColorID(colors, database);
      sizes = await AddSizeID(sizes, database);
      categories = await AddCategoryID(categories, database);
      return await database.Product.insert({
        ...input,
        sizes,
        colors,
        categories,
        promotion_start: promotionStart,
        promotion_end: promotionEnd,
      });
    },
  },
};

export default resolver;
