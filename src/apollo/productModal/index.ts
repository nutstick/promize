import { InMemoryCache } from 'apollo-cache-inmemory';
import * as PRODUCTMODALQUERY from './ProductModalQuery.gql';

export interface ProductModalQuery {
  productModal: {
    id: string,
    show: boolean,
    __typename?: string;
  };
}

export const state = {
  Query: {
    productModal: () => ({
      id: null,
      show: false,
      __typename: 'ProductModal',
    }),
  },
  Mutation: {
    openProductModal(_, variables, { cache }: { cache: InMemoryCache }) {
      const { id } = variables;
      const { productModal: { show } } = cache.readQuery<ProductModalQuery>({ query: PRODUCTMODALQUERY });

      cache.writeQuery({
        query: PRODUCTMODALQUERY,
        variables,
        data: {
          productModal: {
            id,
            show: true,
            __typename: 'ProductModal',
          },
        },
      });

      return null;
    },
    closeProductModal(_, __, { cache }: { cache: InMemoryCache }) {
      cache.writeQuery({
        query: PRODUCTMODALQUERY,
        data: {
          productModal: {
            id: null,
            show: false,
            __typename: 'ProductModal',
          },
        },
      });

      return null;
    },
  },
};
