import { InMemoryCache } from 'apollo-cache-inmemory';
import * as SIDEBARQUERY from './SidebarQuery.gql';

export interface SidebarQuery {
  sidebar: {
    show: boolean,
    __typename?: string;
  };
}

export const state = {
  Query: {
    sidebar: () => ({
      show: false,
      __typename: 'Sidebar',
    }),
  },
  Mutation: {
    toggleSidebar(_, __, { cache }: { cache: InMemoryCache }) {
      const { sidebar: { show } } = cache.readQuery<SidebarQuery>({ query: SIDEBARQUERY });

      cache.writeQuery({ query: SIDEBARQUERY, data: { sidebar: { show: !show, __typename: 'Login' } } });

      return null;
    },
  },
};
