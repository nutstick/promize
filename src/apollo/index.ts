import { ApolloCache } from 'apollo-cache';
import { InMemoryCache } from 'apollo-cache-inmemory/lib/inMemoryCache';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import history from '../core/history';
import { parse, stringify } from '../core/urlParser';
// import * as ADDTODOMUTATION from './AddTodoMutation.gql';
import * as GETTASKQUERY from './GetTaskQuery.gql';
import { IntlQuery, LocaleQuery } from './intl';
import * as LOCALEQUERY from './LocaleQuery.gql';

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
      locale: () => 'en-US',
      initialNow: () => Date.now(),
    },
    Mutation: {
      addTodo: update(GETTASKQUERY, ({ todos }, { message, title }) => ({
        todos: todos.concat([{ message, title, __typename: 'Todo' }]),
      })),

      setLocale(result, variables, { cache }: { cache: InMemoryCache }) {
        const { locale } = variables;
        const { availableLocales, initialNow } = cache.readQuery<LocaleQuery>({ query: LOCALEQUERY });

        cache.writeQuery({ query: LOCALEQUERY, variables, data: { locale, initialNow, availableLocales } });

        if (process.env.BROWSER) {
          const maxAge = 3650 * 24 * 3600; // 10 years in seconds
          document.cookie = `lang=${locale};path=/;max-age=${maxAge}`;
          history.push({
            ...history.location,
            search: stringify({
              ...parse(history.location),
              lang: locale,
            }),
          });
        }

        return null;
      },
    },
  });

  const client = new ApolloClient({
    ...options,
    link: local.concat(link),
  });

  return client;
};
