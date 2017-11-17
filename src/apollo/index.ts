import { ApolloCache } from 'apollo-cache';
import { InMemoryCache } from 'apollo-cache-inmemory/lib/inMemoryCache';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import * as GETTASKQUERY from './GetTaskQuery.gql';
import { state as intl } from './intl';
import { state as login } from './login';

interface IOptions {
  link: ApolloLink;
  ssrMode?: boolean;
  cache: ApolloCache<any>;
  ssrForceFetchDelay?: number;
}

export const createApolloClient = ({ link, ...options }: IOptions) => {
  const update = (query, updater) => (result, variables, { cache }: { cache: InMemoryCache }) => {
    const data = updater(cache.readQuery({ query, variables }), variables);
    cache.writeQuery({ query, variables, data });
    return null;
  };

  const local = withClientState({
    Query: {
      todos: () => [],
      ...intl.Query,
      ...login.Query,
    },
    Mutation: {
      addTodo: update(GETTASKQUERY, ({ todos }, { message, title }) => ({
        todos: todos.concat([{ message, title, __typename: 'Todo' }]),
      })),
      ...intl.Mutation,
      ...login.Mutation,
    },
  });

  const client = new ApolloClient({
    ...options,
    link: local.concat(link),
  });

  return client;
};
