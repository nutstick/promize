import { InMemoryCache } from 'apollo-cache-inmemory';
import * as PRODUCTMODALQUERY from './ProductModalQuery.gql';

export interface LoginQuery {
  productModal: {
    id: string,
    show: boolean,
  };
}

export const state = {
  Query: {
    productModal: () => ({
      id: null,
      show: false,
    }),
  },
  Mutation: {
    toggleProductModal(_, { id }, { cache }: { cache: InMemoryCache }) {
      const { productModal: { show } } = cache.readQuery<LoginQuery>({ query: PRODUCTMODALQUERY });

      cache.writeQuery({
        query: PRODUCTMODALQUERY,
        data: {
          productModal: {
            id,
            show: !show,
          },
        },
      });

      return null;
    },
  },
};
