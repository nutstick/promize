import { IReceiptDocument } from '../../models/Receipt';
import { IUserDocument } from '../../models/User';
import { IResolver, TypeResolver } from '../index';
import { pagination } from '../Pagination/resolver';

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
  async orderReceipts({ _id: buyer }, args, { database }) {
    const cursor = database.Receipt.find({ buyer }).cursor;

    return await pagination<IReceiptDocument>(cursor, {
      name: 'OrderReceipt',
      ...args,
    });
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
    async citizenCardImage({ _id, citizen_card_image }, _, { database, user }) {
      const userInstance = await database.User.findOne({ _id: user._id });
      if (userInstance._id === _id || userInstance.type === 'Admin') {
        return citizen_card_image;
      }
      return null;
    },
    coSellerRegisterStatus({ coseller_register_status }, _, { database }) {
      return coseller_register_status.toUpperCase();
    },
  },
  CoSeller: {
    async citizenCardImage({ _id, citizen_card_image }, _, { database, user }) {
      const userInstance = await database.User.findOne({ _id: user._id });
      if (userInstance._id === _id || userInstance.type === 'Admin') {
        return citizen_card_image;
      }
      return null;
    },
    ...UserTypeResolver,
    coseller() {
      return true;
    },
    async products({ _id: owner }, args, { database }) {
      const cursor = database.Product.find({ owner }).cursor;
      return await pagination(cursor, {
        name: 'Product',
        ...args,
      });
    },
    async buyOrderReceipts({ _id: owner }, { status, ...args }, { database }) {
      // Find all products
      const products = await database.Product.find({ owner }, { _id: 1 }).toArray();
      // Find all receipts of products with status filter
      const cursor = database.Receipt.find({
        product: {
          $in: products.map((product) => product._id),
        },
        ...status && {
          status,
        },
      }).cursor;

      return await pagination(cursor, {
        name: 'BuyOrderReceipts',
        ...args,
      });
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
  Admin: {
    ...UserTypeResolver,
    admin() {
      return true;
    },
    async pendingCoSellers(_, { status, ...args }, { database }) {
      // Find all receipts of products with status filter
      const cursor = database.User.find({ coseller_register_status: 'Pending' }).cursor;

      return await pagination(cursor, {
        name: 'PendingCoSeller',
        ...args,
      });
    },
  },
};

export default resolver;
