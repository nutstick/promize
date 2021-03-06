// polyfills
import main from './main.client';

function run() {
  // Run the application when both DOM is ready and page content is loaded
  if (
    ['complete', 'loaded', 'interactive'].includes(document.readyState) &&
    document.body
  ) {
    main();
  } else {
    document.addEventListener('DOMContentLoaded', main, false);
  }
}

if (!global.Intl) {
  // You can show loading banner here

  (require as any).ensure(
    [
      // Add all large polyfills here
      'intl',
      /* @intl-code-template 'intl/locale-data/jsonp/${lang}.js', */
      'intl/locale-data/jsonp/en.js',
      'intl/locale-data/jsonp/th.js',
      /* @intl-code-template-end */
    ],
    (require) => {
      // and require them here
      require('intl');
      // TODO: This is bad. You should only require one language dynamically
      /* @intl-code-template require('intl/locale-data/jsonp/${lang}.js'); */
      require('intl/locale-data/jsonp/en.js');
      require('intl/locale-data/jsonp/th.js');
      /* @intl-code-template-end */
      run();
    },
    'polyfills',
  );
} else {
  run();
}
