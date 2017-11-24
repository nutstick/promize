import * as BluebirdPromise from 'bluebird';
import * as fs from 'fs';
import { GraphQLError } from 'graphql';
import { toObjectID } from 'iridium';
import { Cursor } from 'mongodb';
import { join } from 'path';
import { locales } from '../../../config';
import { IProductDocument } from '../../models/Product';
import { base64, unbase64 } from '../base64';
import { IResolver } from '../index';
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

    async search(_, { keywords, first, after, last, before, orderBy }: ISearchArgs, { database }) {
      // Add default sort by _id
      orderBy = orderBy ? orderBy.concat([{ sort: '_id', direction: 'ASC' }]) : [{ sort: '_id', direction: 'ASC' }];

      // Parse orderBy to mongodb sort format
      const sort: any = orderBy ? orderBy.reduce((prev, order) => ({
        ...prev,
        [order.sort]: (order.direction === 'ASC' ? 1 : -1),
      }), {}) : {};

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

      if (after) {
        const { name, _id, ...cursorData } = JSON.parse(unbase64(after));
        if (name !== 'ProductCursor') {
          throw new GraphQLError('after type is not ProductCursor');
        }
        cursor = (cursor as any).min({
          ...cursorData,
          ..._id && {
            _id: toObjectID(_id),
          },
        });
      }
      if (first) {
        cursor = cursor.limit(first + 1);
      }
      if (before) {
        const { name, _id, ...cursorData } = JSON.parse(unbase64(before));
        if (name !== 'ProductCursor') {
          throw new GraphQLError('before type is not ProductCursor');
        }
        cursor = (cursor as any).max({
          ...cursorData,
          ..._id && {
            _id: toObjectID(_id),
          },
        });
      }
      if (last) {
        cursor = cursor.limit(last + 1);
      }

      cursor = cursor.sort(sort);

      const totalCount = await cursor.count();
      const products = await cursor.toArray();

      // Has next page
      if (products.length > (first || last)) {
        const endCursor = base64(JSON.stringify(
          orderBy.reduce((prev, order) => ({
            ...prev,
            [order.sort]: products[products.length - 1][order.sort],
          }), { name: 'ProductCursor' }),
        ));

        return {
          totalCount,
          edges: products.slice(0, -1).map((product) => ({
            product,
            orderBy,
          })),
          pageInfo: {
            endCursor,
            hasNextPage: true,
          },
        };
      }

      return {
        totalCount,
        edges: products.map((product) => ({
          product,
          orderBy,
        })),
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
        },
      };
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
