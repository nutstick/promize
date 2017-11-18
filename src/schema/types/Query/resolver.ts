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
      return 'Hello World';
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

    search(_, { keywords, first, after }, { database }) {
      // FIXME: Sure error when search with owner
      let products;
      const list_of_keyword = [];
      if (keywords) {
        for (const i in keywords) {
          if (keywords[i].id) {
            list_of_keyword.push({
              owner: keywords[i].id,
            });
          } else if (keywords[i].special_keyword) {
            const special = keywords[i].special_keyword;
            if (special === 'endsoon') {
              const next_3 = new Date();
              next_3.setDate(next_3.getDate() + 3);
              list_of_keyword.push({
                promotion_end: {
                  $lte: next_3,
                },
              });
            }
          } else {
            const keyword = keywords[i].keyword;
            list_of_keyword.push({
              $or: [
                { hashtag: keyword },
                { colors: keyword },
                { sizes: keyword },
                { name: keyword },
              ],
            });
          }
        }
        products = database.Product.find({
          $and: list_of_keyword,
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
      return await database.Product.findOne({
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
