import { InMemoryCache } from 'apollo-cache-inmemory';
import * as LOGINQUERY from './LoginQuery.gql';

export interface LoginQuery {
  // login: false,
  login: {
    modal: boolean,
  };
}

export const state = {
  Query: {
    login: () => ({
      modal: false,
      __typename: 'Login',
    }),
    // login: () => false,
  },
  Mutation: {
    toggleLoginModal(_, __, { cache }: { cache: InMemoryCache }) {
      const { login: { modal } } = cache.readQuery<LoginQuery>({ query: LOGINQUERY });

      cache.writeQuery({ query: LOGINQUERY, data: { login: { modal: !modal } } });

      return null;
    },
  },
};
