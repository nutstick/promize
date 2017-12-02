import * as BluebirdPromise from 'bluebird';
import * as fs from 'fs';
import { Cursor } from 'mongodb';
import { join } from 'path';
import { locales } from '../../../config';
import { IProductDocument } from '../../models/Product';
import { IResolver } from '../index';
import { pagination } from '../Pagination/resolver';
import { IProductOrdering } from '../Product';

// A folder with messages
// In development, source dir will be used
const MESSAGES_DIR = process.env.MESSAGES_DIR || join(__dirname, './messages');

const readFile = BluebirdPromise.promisify(fs.readFile);

interface IHashtag {
  _id: null;
  uniqueValues: { $addToSet: '$hashtag' };
}

interface ISearchArgs {
  keywords: any[];
  first: number;
  after: string;
  last: number;
  before: string;
  orderBy: IProductOrdering[];
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

    async search(_, { keywords, ...args }: ISearchArgs, { database }) {
      let cursor: Cursor<IProductDocument>;
      if (keywords.length > 0) {
        const searchContext = keywords.reduce((prev, keyword) => {
          if (keyword.id) {
            return [...prev, {
              owner: keyword.id,
            }];
          } else if (keyword.special_keyword) {
            const { special_keyword }: { special_keyword: string } = keyword;
            if (special_keyword.toLowerCase() === 'endsoon') {
              const next3Days = new Date();
              next3Days.setDate(next3Days.getDate() + 3);
              return [...prev, {
                promotion_end: {
                  $lte: next3Days,
                },
              }];
            }
            // TODO: New special keyword
          } else if (keyword.keyword) {
            return [...prev, {
              $or: [
                { hashtags: keyword.keyword },
                { 'colors.color': keyword.keyword },
                { 'sizes.size': keyword.keyword },
                { name: keyword.keyword },
              ],
            }];
          }
        }, []);

        cursor = database.Product.find({
          $and: searchContext,
        }).cursor;
      } else {
        // No keyword specific
        cursor = database.Product.find().cursor;
      }

      return await pagination<IProductDocument>(cursor, {
        name: 'Product',
        ...args,
      });
    },

    async product(_, { id }, { database }) {
      return await database.Product.findOne({
        _id: id,
      });
    },

    async hashtags(_, __, { database }) {
      const hashtag = await database.Product.aggregate<IHashtag>([
        { $unwind: '$hashtag' },
        {
          $group: {
            _id: null,
            uniqueValues: { $addToSet: '$hashtag' },
          },
        },
      ]);
      return hashtag[0].uniqueValues;
    },

    async user(_, { id }, { database }) {
      return await database.User.findOne({
        _id: id,
      });
    },
  },
};

export default resolver;
