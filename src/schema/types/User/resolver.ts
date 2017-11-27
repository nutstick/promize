import { GraphQLError } from 'graphql';
import { toObjectID } from 'iridium';
import { Cursor } from 'mongodb';
import { IReceiptDocument } from '../../models/Receipt/index';
import { IUserDocument } from '../../models/User/index';
import { base64, unbase64 } from '../base64';
import { IResolver, ResolverFn, TypeResolver } from '../index';
import { ITradeRoom } from '../Traderoom/index';

const UserTypeResolver: TypeResolver<IUserDocument> = {
  firstName({ first_name }) {
    return first_name;
  },
  middleName({ middle_name }) {
    return middle_name;
  },
  lastName({ last_name }) {
    return last_name;
  },
  telNumber({ tel_number }) {
    return tel_number;
  },
  paymentMethod({ payment_methods }, { id }) {
    return payment_methods.find((payment_method) => payment_method._id === id);
  },
  paymentMethods({ payment_methods }) {
    return payment_methods;
  },
  address({ addresses }, { id }) {
    return addresses.find((address) => address._id === id);
  },
  async citizenCardImage({ _id, citizen_card_image }, _, { database, user }) {
    const userInstance = await database.User.findOne({ _id: user._id });
    if (userInstance._id === _id || userInstance.type === 'Admin') {
      return citizen_card_image;
    }
    return null;
  },
  async orderReceipts({ _id: buyer }, { first, after, last, before, orderBy }, { database }) {
    // Add default sort by _id
    orderBy = orderBy ? orderBy.concat([{ sort: '_id', direction: 'ASC' }]) : [{ sort: '_id', direction: 'ASC' }];

    // Parse orderBy to mongodb sort format
    const sort: any = orderBy ? orderBy.reduce((prev, order) => ({
      ...prev,
      [order.sort]: (order.direction === 'ASC' ? 1 : -1),
    }), {}) : {};

    let cursor = database.Receipt.find({ buyer }).cursor;

    if (after) {
      const { name, _id, ...cursorData } = JSON.parse(unbase64(after));
      if (name !== 'OrderReceiptCursor') {
        throw new GraphQLError('after type is not OrderReceiptCursor');
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
      if (name !== 'OrderReceiptCursor') {
        throw new GraphQLError('before type is not OrderReceiptCursor');
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
    const orderReceipts = await cursor.toArray();

    // Has next page
    if (orderReceipts.length > (first || last)) {
      const endCursor = base64(JSON.stringify(
        orderBy.reduce((prev, order) => ({
          ...prev,
          [order.sort]: orderReceipts[orderReceipts.length - 1][order.sort],
        }), { name: 'OrderReceiptCursor' }),
      ));

      return {
        totalCount,
        edges: orderReceipts.slice(0, -1).map((orderReceipt) => ({
          orderReceipts,
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
      edges: orderReceipts.map((orderReceipt) => ({
        orderReceipt,
        orderBy,
      })),
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
      },
    };
  },
  async traderooms({ _id }, _, { database }) {
    return await database.Traderoom.find({ participants: _id }).toArray();
  },
  async traderoom({ _id }, { id }, { database }) {
    return await database.Traderoom.findOne({ _id: id });
  },
};

const resolver: IResolver<any, any> = {
  Account: {
    facebookAccessCode({ facebook }) {
      return facebook && facebook.accessCode;
    },
    googleAccessCode({ google }) {
      return google && google.accessCode;
    },
  },
  PaymentMethod: {
    creditCardNumber({ credit_card_number }) {
      // For security credit card number will only show last 4 digits.
      return '#'.repeat(credit_card_number.length - 4) + credit_card_number.slice(-4);
    },
  },
  UserType: {
    __resolveType({ type }) {
      return type;
    },
  },
  User: {
    ...UserTypeResolver,
    coSellerRegisterStatus({ coseller_register_status }, _, { database }) {
      return coseller_register_status.toUpperCase();
    },
  },
  Admin: {
    ...UserTypeResolver,
  },
  CoSeller: {
    ...UserTypeResolver,
    coseller() {
      return true;
    },
    async products({ _id: owner }, { first, after, last, before, orderBy }, { database }) {
      // Add default sort by _id
      orderBy = orderBy ? orderBy.concat([{ sort: '_id', direction: 'ASC' }]) : [{ sort: '_id', direction: 'ASC' }];

      // Parse orderBy to mongodb sort format
      const sort: any = orderBy ? orderBy.reduce((prev, order) => ({
        ...prev,
        [order.sort]: (order.direction === 'ASC' ? 1 : -1),
      }), {}) : {};

      let cursor = database.Product.find({ owner }).cursor;

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
    async buyOrderReceipts({ _id: owner }, { first, after, last, before, orderBy, status }, { database }) {
      // Add default sort by _id
      orderBy = orderBy ? orderBy.concat([{ sort: '_id', direction: 'ASC' }]) : [{ sort: '_id', direction: 'ASC' }];

      // Parse orderBy to mongodb sort format
      const sort: any = orderBy ? orderBy.reduce((prev, order) => ({
        ...prev,
        [order.sort]: (order.direction === 'ASC' ? 1 : -1),
      }), {}) : {};

      // Find all products
      const products = await database.Product.find({ owner }, { _id: 1 }).toArray();
      // Find all receipts of products with status filter
      let cursor = database.Receipt.find({
        product: {
          $in: products.map((product) => product._id),
        },
        ...status && {
          status,
        },
      }).cursor;

      if (after) {
        const { name, _id, ...cursorData } = JSON.parse(unbase64(after));
        if (name !== 'OrderReceiptCursor') {
          throw new GraphQLError('after type is not OrderReceiptCursor');
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
        if (name !== 'OrderReceiptCursor') {
          throw new GraphQLError('before type is not OrderReceiptCursor');
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
      const orderReceipts = await cursor.toArray();

      // Has next page
      if (orderReceipts.length > (first || last)) {
        const endCursor = base64(JSON.stringify(
          orderBy.reduce((prev, order) => ({
            ...prev,
            [order.sort]: orderReceipts[orderReceipts.length - 1][order.sort],
          }), { name: 'OrderReceiptCursor' }),
        ));

        return {
          totalCount,
          edges: orderReceipts.slice(0, -1).map((orderReceipt) => ({
            orderReceipts,
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
        edges: orderReceipts.map((orderReceipt) => ({
          orderReceipt,
          orderBy,
        })),
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
        },
      };
    },
    async totalBuyOrderReceipts({ owner }, { status }, { database }) {
      // Find all products
      const products = await database.Product.find({ owner }, { _id: 1 }).toArray();
      // Find all receipts of products with status filter
      return await database.Receipt.find({
        product: {
          $in: products.map((product) => product._id),
        },
        ...status && {
          status,
        },
      }).count();
    },
  },
};

export default resolver;
