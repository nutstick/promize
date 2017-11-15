import * as BluebirdPromise from 'bluebird';
import * as fs from 'fs';
import { join } from 'path';
import { locales } from '../../../config';
import { IResolver } from '../index';

// A folder with messages
// In development, source dir will be used
const MESSAGES_DIR = process.env.MESSAGES_DIR || join(__dirname, './messages');

const readFile = BluebirdPromise.promisify(fs.readFile);

interface ICategory {
  _id: null;
  uniqueValues: { $addToSet: '$hashtag' };
}

const resolver: IResolver<any, any> = {
  Query: {
    helloworld() {
      return 'Hello Word';
    },
    async me(_, __, { database, user }) {
      if (user && user._id) {
        return await database.User.findOne({ _id: user._id });
      }
      return null;
    },
    async intl(_, { locale }) {
      if (!locales.includes(locale)) {
        throw new Error(`Locale '${locale}' not supported`);
      }

      let localeData;
      try {
        localeData = await readFile(join(MESSAGES_DIR, `${locale}.json`));
      } catch (err) {
        if (err.code === 'ENOENT') {
          throw new Error(`Locale '${locale}' not found`);
        }
      }

      return JSON.parse(localeData);
    },

    search(_, { keyword, first, after }, { database }) {
      // FIXME: Sure error when search with owner
      let products;
      if (keyword) {
         products = database.Product.find({
          $or: [
            { hashtag: keyword },
            { name: keyword },
            { owner_name: keyword },
          ],
        });
      } else {
        products = database.Product.find();
      }
      if (first) {
        products = products.skip(after);
      }
      if (after) {
        products = products.limit(first);
      }
      return products;
    },

    async product(_, { id }, { database }) {
      return await database.Product.find({
        _id: id,
      });
    },

    async categorys(_, __, { database }) {
      const category = await database.Product.aggregate<ICategory>([
        { $unwind: '$hashtag' },
        {
          $group: {
            _id: null,
            uniqueValues: { $addToSet: '$hashtag' },
          },
        },
      ]);
      return category[0].uniqueValues;
    },

  },
};

export default resolver;
