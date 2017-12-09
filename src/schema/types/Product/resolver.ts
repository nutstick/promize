import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  ProductEdges: {
  },
  Product: {
    promotionStart({ promotion_start }) {
      return promotion_start;
    },
    promotionEnd({ promotion_end }) {
      return promotion_end;
    },
    originalPrice({ orginal_price }) {
      return orginal_price;
    },
    async owner({ owner }, _, { database }) {
      return await database.User.findOne(owner);
    },
  },
};

export default resolver;
