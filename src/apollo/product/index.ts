import { InMemoryCache } from 'apollo-cache-inmemory';
import { IProduct } from '../../schema/types/Product';
import * as FRAGMENT from './ProductFragment.gql';

export interface IProductClient extends IProduct {
  selectedSize?: string;
  selectedColor?: string;
}

export interface LoginQuery {
  login: {
    modal: boolean,
    __typename?: string;
  };
}

export const state = {
  Mutation: {
    selectProductColor(_, { id, color }, { cache }: { cache: InMemoryCache }) {
      if (!id) {
        throw Error('selectProductSize require field `id`');
      }

      id = `Product:${id}`;
      const product = cache.readFragment<IProductClient>({ fragment: FRAGMENT, id });
      const data = {
        ...product,
        selectedSize: product && product.selectedSize,
        selectedColor: color,
      };

      cache.writeFragment({
        id,
        fragment: FRAGMENT,
        data,
      });

      return data;
    },
    selectProductSize(_, { id, size }, { cache }: { cache: InMemoryCache }) {
      if (!id) {
        throw Error('selectProductSize require field `id`');
      }

      id = `Product:${id}`;
      const product = cache.readFragment<IProductClient>({ fragment: FRAGMENT, id });
      const data = {
        ...product,
        selectedSize: size,
        selectedColor: product && product.selectedColor,
      };

      cache.writeFragment({
        id,
        fragment: FRAGMENT,
        data,
      });

      return data;
    },
  },
  Product: {
    selectedSize: (source, args, context) => {
      // list items default to an unselected state
      return null;
    },
    selectedColor: (source, args, context) => {
      // list items default to an unselected state
      return null;
    },
  },
};
