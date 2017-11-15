import { ApolloCache } from 'apollo-cache';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';

// import * as ADDTODOMUTATION from './AddTodoMutation.gql';
import * as GETTASKQUERY from './GetTaskQuery.gql';

interface IOptions {
  link: ApolloLink;
  ssrMode?: boolean;
  cache?: ApolloCache<any>;
  ssrForceFetchDelay?: number;
}

export const createApolloClient = ({ link, ...options }: IOptions) => {
  const update = (query, updater) => (result, variables, { cache }: { cache: InMemoryCache}) => {
    const data = updater(cache.readQuery({ query, variables }), variables);
    cache.writeQuery({ query, variables, data });
    return null;
  };

  const local = withClientState({
    Query: {
      todos: () => [],
    },
    Mutation: {
      addTodo: update(GETTASKQUERY, ({ todos }, { message, title }) => ({
        todos: todos.concat([{ message, title, __typename: 'Todo' }]),
      })),
    },
  });

  const client = new ApolloClient({
    ...options,
    link: local.concat(link),
    cache: new InMemoryCache(),
  });

  return client;
};
