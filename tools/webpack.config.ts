import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';
import { Configuration, Resolve } from 'webpack';
import * as WebpackAssetsManifest from 'webpack-assets-manifest';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import * as nodeExternals from 'webpack-node-externals';
import * as pkg from '../package.json';
import overrideRules from './lib/overrideRules';

const ROOT_DIR = path.resolve(__dirname, '..');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const SRC_DIR = resolvePath('src');
const BUILD_DIR = resolvePath('dist');

export const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const isAnalyze =
  process.argv.includes('--analyze') || process.argv.includes('--analyse');

// Hard choice here...
// You can enforce this for test environments :-)
const REACT_INTL_ENFORCE_DESCRIPTIONS = false;

const minimizeCssOptions = {
  discardComments: { removeAll: true },
};

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config: webpack.Configuration = {
  context: ROOT_DIR,

  mode: isDebug ? 'development' : 'production',

  output: {
    path: resolvePath(BUILD_DIR, 'public/assets'),
    publicPath: '/assets/',
    pathinfo: isVerbose,
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug
      ? '[name].chunk.js'
      : '[name].[chunkhash:8].chunk.js',
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: ['node_modules', 'src'],
  },

  module: {
    // Make missing exports an error instead of warning
    strictExportPresence: true,

    rules: [
      {
        test: /\.ts(x?)$/,
        include: [SRC_DIR, resolvePath('tools')],
        loader: 'awesome-typescript-loader',
        options: {
          useBabel: true,
          useCache: true,
          babelOptions: {
            presets: [
              // A Babel preset that can automatically determine the Babel plugins and polyfills
              // https://github.com/babel/babel-preset-env
              [
                'env',
                {
                  targets: {
                    // browsers: pkg.browserslist,
                    // uglify: true,
                    node: 'current',
                  },
                  modules: false,
                  useBuiltIns: false,
                  debug: false,
                },
              ],
              // Experimental ECMAScript proposals
              // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
              'stage-2',
              // JSX, Flow
              // https://github.com/babel/babel/tree/master/packages/babel-preset-react
              'react',
              // Optimize React code for the production build
              // https://github.com/thejameskyle/babel-react-optimize
              ...(isDebug ? [] : ['react-optimize']),
            ],
            plugins: [
              ...(isDebug ? [] : ['transform-decorators-legacy']),
              // Adds component stack to warning messages
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source
              ...(isDebug ? [] : ['transform-react-jsx-source']),
              // Adds __self attribute to JSX which React will use for some warnings
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
              ...(isDebug ? [] : ['transform-react-jsx-self']),
              [
                'react-intl',
                {
                  messagesDir: path.resolve(
                    __dirname,
                    '../dist/messages/extracted',
                  ),
                  extractSourceLocation: true,
                  enforceDescriptions: REACT_INTL_ENFORCE_DESCRIPTIONS,
                },
              ],
            ],
          },
        },
      },
      {
        test: /react-icons\/(.)*(.js)$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.(css|less|scss|sss)$/,
        rules: [
          // Convert CSS into JS module
          {
            issuer: { not: [/\.(css|less|scss|sss)$/] },
            use: 'isomorphic-style-loader',
          },

          // Process external/third-party styles
          {
            include: /node_modules/,
            exclude: path.resolve(__dirname, '../src'),
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              minimize: isDebug ? false : minimizeCssOptions,
            },
          },

          // Process internal/project styles (from src folder)
          {
            include: path.resolve(__dirname, '../src'),
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              sourceMap: isDebug,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: isDebug
                ? '[name]-[local]-[hash:base64:5]'
                : '[hash:base64:5]',
              // CSS Nano http://cssnano.co/
              minimize: isDebug ? false : minimizeCssOptions,
              camelCase: false,
            },
          },

          // Apply PostCSS plugins including autoprefixer
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './tools/postcss.config.js',
              },
            },
          },

          // Compile Less to CSS
          // https://github.com/webpack-contrib/less-loader
          // Install dependencies before uncommenting: yarn add --dev less-loader less
          // {
          //   test: /\.less$/,
          //   loader: 'less-loader',
          // },

          // Compile Sass to CSS
          // https://github.com/webpack-contrib/sass-loader
          // Install dependencies before uncommenting: yarn add --dev sass-loader node-sass
          // {
          //   test: /\.(scss|sass)$/,
          //   loader: 'sass-loader',
          // },
        ],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          name: isDebug ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
          limit: 10000,
        },
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        query: {
          name: isDebug ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
        },
      },
      {
        test: /\.(graphql|gql)$/,
        // include: [
        //   path.resolve(__dirname, '../src'),
        // ],
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },

      // Exclude dev modules from production build
      ...(isDebug
        ? []
        : [
            {
              test: path.resolve(
                __dirname,
                '../node_modules/react-deep-force-update/lib/index.js',
              ),
              loader: 'null-loader',
            },
          ]),
    ],
  },

  bail: !isDebug,
  cache: isDebug,

  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },

  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: isDebug ? 'cheap-module-source-map' : 'source-map',
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig: Configuration = {
  ...config,

  name: 'client',
  target: 'web',

  entry: {
    client: ['babel-polyfill', './src/loader.client.ts'],
  },

  // output: {
  //   filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
  //   chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  // },

  plugins: [

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      '__DEV__': isDebug,
    }),

    // Emit a file with assets paths
    // https://github.com/webdeveric/webpack-assets-manifest#options
    new WebpackAssetsManifest({
      output: `${BUILD_DIR}/asset-manifest.json`,
      publicPath: true,
      writeToDisk: true,
      customize: ({ key, value }) => {
        // You can prevent adding items to the manifest by returning false.
        if (key.toLowerCase().endsWith('.map')) { return false; }
        return { key, value };
      },
      done: (manifest, stats) => {
        // Write chunk-manifest.json.json
        const chunkFileName = `${BUILD_DIR}/chunk-manifest.json`;
        try {
          const fileFilter = (file) => !file.endsWith('.map');
          const addPath = (file) => manifest.getPublicPath(file);
          const chunkFiles = stats.compilation.chunkGroups.reduce((acc, c) => {
            acc[c.name] = [
              ...(acc[c.name] || []),
              ...c.chunks.reduce(
                (files, cc) => [
                  ...files,
                  ...cc.files.filter(fileFilter).map(addPath),
                ],
                [],
              ),
            ];
            return acc;
          }, Object.create(null));
          fs.writeFileSync(chunkFileName, JSON.stringify(chunkFiles, null, 2));
        } catch (err) {
          console.error(`ERROR: Cannot write ${chunkFileName}: `, err);
          if (!isDebug) { process.exit(1); }
        }
      },
    }),

    ...(isDebug
      ? []
      : [
          // Webpack Bundle Analyzer
          // https://github.com/th0r/webpack-bundle-analyzer
          ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
        ]),
  ],

  // Choose a developer tool to enhance debugging
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? 'cheap-module-source-map' : false,

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig: Configuration = {
  ...config,

  name: 'server',
  target: 'node',

  entry: {
    server: ['babel-polyfill', './src/main.server.tsx'],
  },

  output: {
    ...config.output,
    path: BUILD_DIR,
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    ...config.resolve,
  },

  module: {
    ...config.module,

    rules: overrideRules(config.module.rules, (rule) => {
      // Override babel-preset-env configuration for Node.js
      if (rule.loader === 'awesome-typescript-loader') {
        const x = {
          ...rule,
          options: {
            ...rule.options,
            babelOptions: {
              ...rule.options.babelOptions,
              presets: rule.options.babelOptions.presets.map(
                (preset) =>
                  preset[0] !== 'env'
                    ? preset
                    : [
                        'env',
                        {
                          targets: {
                            node: 'current',
                          },
                          // modules: false,
                          // useBuiltIns: false,
                          // debug: false,
                        },
                      ],
              ),
            },
          },
        };
        return {
          ...rule,
          options: {
            ...rule.options,
            babelOptions: {
              ...rule.options.babelOptions,
              presets: rule.options.babelOptions.presets.map(
                (preset) =>
                  preset[0] !== 'env'
                    ? preset
                    : [
                        'env',
                        {
                          targets: {
                            node: 'current',
                          },
                          modules: false,
                          useBuiltIns: false,
                          debug: false,
                        },
                      ],
              ),
            },
          },
        };
      }

      // Override paths to static assets
      // if (
      //   rule.loader === 'file-loader' ||
      //   rule.loader === 'url-loader' ||
      //   rule.loader === 'svg-url-loader'
      // ) {
      //   return {
      //     ...rule,
      //     options: {
      //       ...rule.options,
      //       name: `public/assets/${rule.options.name}`,
      //       publicPath: (url) => url.replace(/^public/, ''),
      //     },
      //   };
      // }

      return rule;
    }),
  },
  externals: [
    './chunk-manifest.json',
    './asset-manifest.json',
    nodeExternals({
      whitelist: [/\.(css|less|scss|sss)$/, /\.(bmp|gif|jpe?g|png|svg)$/],
    }),
  ],

  plugins: [

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': false,
      '__DEV__': isDebug,
    }),

    // Adds a banner to the top of each generated chunk
    // https://webpack.js.org/plugins/banner-plugin/
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),

  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};

//
// Configuration for the socket bundle (socket.js)
// -----------------------------------------------------------------------------

const socketConfig: Configuration = {
  ...serverConfig,

  name: 'socket',
  target: 'node',

  entry: {
    socket: ['babel-polyfill', './src/main.socket.ts'],
  },

  plugins: [
    ...serverConfig.plugins,
    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': false,
      'process.env.SOCKET': true,
      '__DEV__': isDebug,
    }),
  ],
};

export default [clientConfig, serverConfig, socketConfig];
