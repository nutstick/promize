import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { apolloUploadExpress } from 'apollo-upload-server';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as expressJwt from 'express-jwt';
import { UnauthorizedError as Jwt401Error } from 'express-jwt';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import * as PrettyError from 'pretty-error';
import * as React from 'react';
import { getDataFromTree } from 'react-apollo';
import * as ReactDOM from 'react-dom/server';
import { IntlProvider } from 'react-intl';
import { StaticRouter } from 'react-router';
import { createApolloClient } from './apollo';
import { IntlQuery } from './apollo/intl';
import * as INTLQUERY from './apollo/intl/IntlQuery.gql';
import * as LOCALEQUERY from './apollo/intl/LocaleQuery.gql';
import * as chunks from './chunk-manifest.json';
import App from './components/App';
import { Html } from './components/Html';
import { api, auth, locales, port, wsport } from './config';
import passport from './core/passport';
import { requestLanguage } from './core/requestLanguage';
import { ServerLink } from './core/ServerLink';
import Routes from './routes';
import ErrorPage from './routes/Error/ErrorPage';
import * as errorPageStyle from './routes/Error/ErrorPage.css';
import { Schema } from './schema';
import { database } from './schema/models';

/**
 * Express app
 */
interface HotExpress extends express.Express {
  hot: any;

  wsServer: any;
}

const app = express() as HotExpress;

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
declare var global: any;

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(
  requestLanguage({
    languages: locales,
    queryName: 'lang',
    cookie: {
      name: 'lang',
      options: {
        path: '/',
        maxAge: 3650 * 24 * 3600 * 1000, // 10 years in miliseconds
      },
      url: '/lang/{language}',
    },
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: (req) => req.cookies.id_token,
}));
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    // tslint:disable-next-line:no-console
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});
app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false }),
);
app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign({
      _id: req.user._id,
    }, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);

app.get('/logout', (req, res) => {
  res.clearCookie('id_token');
  req.logout();
  res.redirect('/');
});

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', bodyParser.json(), apolloUploadExpress({ uploadDir: './public/images' }),
  graphqlExpress((req, res) => ({
    schema: Schema,
    context: {
      database,
      req,
      res,
      user: req.user,
    },
    rootValue: { request: req },
  })));
app.get('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${wsport}/subscriptions`,
}));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
const setLocale = async (client: ApolloClient<any>, { locale, initialNow }, { cache }) => {
  const { data } = await client.query<IntlQuery>({
    query: INTLQUERY,
    variables: { locale },
  });

  const messages = data.intl.reduce((msgs, msg) => {
    msgs[msg.id] = msg.message;
    return msgs;
  }, {});

  client.writeQuery({
    query: LOCALEQUERY,
    variables: {
      locale,
      initialNow,
      availableLocales: locales,
    },
    data: {
      locale,
      initialNow,
      availableLocales: locales,
    },
  });

  const provider = new IntlProvider({
    initialNow,
    locale,
    messages,
    defaultLocale: 'en-US',
  });

  return provider.getChildContext().intl;
};

app.get('*', async (req, res, next) => {
  try {
    const location = req.url;

    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData: {
        __schema: {
          types: [{
            kind: 'INTERFACE',
            name: 'UserType',
            possibleTypes: [{ name: 'User' }, { name: 'CoSeller' }],
          }],
        },
      },
    });

    const cache = new InMemoryCache({
      dataIdFromObject(value: any) {
        // Page or Edges
        if (value.__typename.match(/(Page|Edges)/)) {
          return null;
        } else if (value._id) {
          return `${value.__typename}:${value._id}`;
        } else if (value.node) {
          return `${value.__typename}:${value.node._id}`;
        }
        return null;
      },
      fragmentMatcher,
    });

    const client = createApolloClient({
      link: new ServerLink({
        schema: Schema,
        rootValue: { request: req },
        context: {
          database,
          user: req.user,
        },
      }),
      ssrMode: true,
      cache,
    });

    // Fetch locale's messages
    const locale = req.language;
    const intl = await setLocale(client, {
      locale,
      initialNow: Date.now(),
    }, { cache });

    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach((style) => css.add(style._getCss()));
      },
      // Apollo Client for use with react-apollo
      client,
      // intl instance as it can be get with injectIntl
      intl,
    };

    const component = (
      <App context={context}>
        <StaticRouter location={location}>
          <Routes />
        </StaticRouter>
      </App>
    );
    // set children to match context
    // FIXME: https://github.com/apollographql/react-apollo/issues/425
    await getDataFromTree(component);
    // await BluebirdPromise.delay(0);
    const children = ReactDOM.renderToString(component);

    const scripts = new Set();
    const addChunk = (chunk) => {
      if (chunks[chunk]) {
        chunks[chunk].forEach((asset) => scripts.add(asset));
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`);
      }
    };
    addChunk('client');

    const data: Html.IProps = {
      title: 'Promize',
      // TODO: description
      description: 'Promize.',
      styles: [
        { id: 'css', cssText: [...css].join('') },
      ],
      scripts: Array.from(scripts),
      app: {
        apiUrl: api.clientUrl,
        apollo: cache.extract(),
        lang: locale,
      },
      children,
    };

    if (__DEV__) {
      // tslint:disable-next-line:no-console
      console.log('Serializing store...');
    }

    // rendering html components
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(200).send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  const locale = req.language;
  // tslint:disable-next-line:no-console
  console.log(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]}
      app={{ lang: locale }}
    >
      {ReactDOM.renderToString(<ErrorPage error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// ----------------------------------------------------------------------------
// tslint:disable-next-line:no-console
const promise = database.connect().catch((err) => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(port, () => {
      // tslint:disable-next-line:no-console
      console.info(`The server is running at http://localhost:${port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;

  module.hot.accept();
}

export default app;
