import { InMemoryCache } from 'apollo-cache-inmemory';
import * as LOGINQUERY from './LoginQuery.gql';

export interface LoginQuery {
  login: {
    modal: boolean,
    __typename?: string;
  };
}

export const state = {
  Query: {
    login: () => ({
      modal: false,
      __typename: 'Login',
    }),
  },
  Mutation: {
    toggleLoginModal(_, __, { cache }: { cache: InMemoryCache }) {
      const { login: { modal } } = cache.readQuery<LoginQuery>({ query: LOGINQUERY });

      cache.writeQuery({ query: LOGINQUERY, data: { login: { modal: !modal, __typename: 'Login' } } });

      return null;
    },
  },
};
