import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  OrderReceipt: {
    async product({ product }, _, { database }) {
      return await database.Product.findOne({ _id: product });
    },
    async creator({ creator }, _, { database }) {
      return await database.User.findOne({ _id: creator });
    },
  },
};

export default resolver;
