import { base64 } from '../base64';
import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  ProductEdges: {
    node({ product }) {
      return product;
    },
    cursor({ product, orderBy }) {
      const value = orderBy.reduce((prev, order) => ({
        ...prev,
        [order.sort]: product[order.sort],
      }), { name: 'ProductCursor' });
      return base64(JSON.stringify(value));
    },
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
