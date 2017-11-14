import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  ProductEdges: {
    node(root) {
      return root;
    },
    cursor({ _id }) {
      return _id;
    },
  },
  ProductPage: {
    async totalCount(root) {
      return await root.count();
    },
    async edges(root) {
      return await root.toArray();
    },
    pageInfo(root) {
      return {
        endCursor: root.next(),
        hasNextPage: root.cursor.hasNext(),
      };
    },
  },
  Product: {
    promotionStart({ promotion_start }) {
      return promotion_start;
    },
    promotionEnd({ promotion_end }) {
      return promotion_end;
    },
    async owner({ owner }, _, { database }) {
      return await database.User.findOne(owner);
    },
  },
};

export default resolver;
