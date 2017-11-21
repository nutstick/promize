// Needed for redux-saga es6 generator support
// import '!file?name=[name].[ext]!./manifest.json';
// import 'file?name=[name].[ext]!./.htaccess';
// Load the favicon, the manifest.json file and the .htaccess file
// import 'file?name=[name].[ext]!./favicon.ico';
// Import all the third party stuff
import 'whatwg-fetch';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import * as FontFaceObserver from 'fontfaceobserver';
import { createPath } from 'history/PathUtils';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
/* @intl-code-template import ${lang} from 'react-intl/locale-data/${lang}'; */
import * as cs from 'react-intl/locale-data/cs';
import * as en from 'react-intl/locale-data/en';
import * as th from 'react-intl/locale-data/th';
/* @intl-code-template-end */
import { Router } from 'react-router-dom';
import { createApolloClient } from './apollo';
import { getIntlContext } from './apollo/intl';
import App from './components/App';
import { ErrorReporter } from './core/devUtils';
import { updateMeta } from './core/DOMUtils';
import history from './core/history';
import createFetch from './createFetch';

/*
  Apollo Client v2
*/
const http = new HttpLink({
  uri: '/graphql',
  credentials: 'include',
});
const cache = new InMemoryCache({
  dataIdFromObject(value: any) {
    return `${value.__typename}:${value._id}`;
  },
}).restore(window.App.apollo);
const client = createApolloClient({
  link: http,
  ssrForceFetchDelay: 100,
  cache,
});

/* @intl-code-template addLocaleData(${lang}); */
addLocaleData(en);
addLocaleData(cs);
addLocaleData(th);
/* @intl-code-template-end */

const openSansObserver = new FontFaceObserver('Open Sans', {});

openSansObserver.load().then(() => {
  document.body.classList.add('font-loaded');
}, () => {
  document.body.classList.remove('font-loaded');
});

// Universal HTTP client
const fetch = createFetch(self.fetch, {
  baseUrl: window.App.apiUrl,
});

// Set locale

const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map((x) => x._insertCss());
    return () => { removeCss.forEach((f) => f()); };
  },
  fetch,
  // For react-apollo
  client,
  // intl instance as it can be get with injectIntl
  intl: getIntlContext(cache),
};

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
const scrollPositionsHistory = {};
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

let onRenderComplete = function initialRenderComplete(route?, location?) {
  const elem = document.getElementById('css');
  if (elem) {
    elem.parentNode.removeChild(elem);
  }
  onRenderComplete = function renderComplete(route_, location_) {
    updateMeta('description', route_.description);
    // Update necessary tags in <head> at runtime here, ie:
    // updateMeta('keywords', route.keywords);
    // updateCustomMeta('og:url', route.canonicalUrl);
    // updateCustomMeta('og:image', route.imageUrl);
    // updateLink('canonical', route.canonicalUrl);
    // etc.

    let scrollX = 0;
    let scrollY = 0;
    const pos = scrollPositionsHistory[location_.key];
    if (pos) {
      scrollX = pos.scrollX;
      scrollY = pos.scrollY;
    } else {
      const targetHash = location_.hash.substr(1);
      if (targetHash) {
        const target = document.getElementById(targetHash);
        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top;
        }
      }
    }

    // Restore the scroll position if it was saved into the state
    // or scroll to the given #hash anchor
    // or scroll to top of the page
    window.scrollTo(scrollX, scrollY);

    // Google Analytics tracking. Don't send 'pageview' event after
    // the initial rendering, as it was already sent
    if (window.ga) {
      window.ga('send', 'pageview', createPath(location_));
    }
  };
};

const container = document.getElementById('app');
let appInstance;
let currentLocation = history.location;

// Re-render the app when window.location changes
async function onLocationChange(location?, action?) {
  const Routes = require('./routes').default;
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };

  // Delete stored scroll position for next page if any
  if (action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }
  currentLocation = location;
  appInstance = ReactDOM.hydrate(
    <App context={context}>
      <Router history={history}>
        <Routes />
      </Router>
    </App>,
    container,
    () => onRenderComplete(Routes, location),
  );
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
history.listen(onLocationChange);
onLocationChange(currentLocation);

// Handle errors that might happen after rendering
// Display the error in full-screen for development mode
if (__DEV__) {
  window.addEventListener('error', (event) => {
    appInstance = null;
    document.title = `Runtime Error: ${(event as any).error.message}`;
    ReactDOM.render(<ErrorReporter error={(event as any).error} />, document.getElementById('app'));
  });
}

let isHistoryObserved = false;
export default function main() {
  // Handle client-side navigation by using HTML5 History API
  // For more information visit https://github.com/mjackson/history#readme
  currentLocation = history.location;
  if (!isHistoryObserved) {
    isHistoryObserved = true;
    history.listen(onLocationChange);
  }
  onLocationChange(currentLocation);
}

// globally accesible entry point
window.RSK_ENTRY = main;

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./routes', () => {
    if (appInstance) {
      // Force-update the whole tree, including components that refuse to update
      onLocationChange(currentLocation);
    }
  });
}
