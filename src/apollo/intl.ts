import { InMemoryCache } from 'apollo-cache-inmemory/lib/inMemoryCache';
import { IntlProvider } from 'react-intl';
import * as INTLINITIALNOWQUERY from './IntlInitialNowQuery.gql';
import * as INTLQUERY from './IntlQuery.gql';
import * as LOCALEQUERY from './LocaleQuery.gql';

export interface IntlQuery {
  intl: Array<{
    id: string;
    message: string;
  }>;
}

export interface IntlInitialNowQuery {
  initialNow: number;
}

export  interface LocaleQuery {
  locale: string;
  initialNow: number;
  availableLocales: string[];
}

export function getIntlContext(cache: InMemoryCache) {
  const { locale, initialNow } = cache.readQuery<LocaleQuery>({ query: LOCALEQUERY });
  const { intl } = cache.readQuery<IntlQuery>({
    query: INTLQUERY,
    variables: { locale },
  });

  const messages = intl.reduce((msgs, msg) => {
    msgs[msg.id] = msg.message;
    return msgs;
  }, {});

  const provider = new IntlProvider({
    initialNow,
    locale,
    messages,
    defaultLocale: 'en-US',
  });

  return provider.getChildContext().intl;
}
