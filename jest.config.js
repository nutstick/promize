/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// Jest configuration
// https://facebook.github.io/jest/docs/en/configuration.html
module.exports = {
  // Modules can be explicitly auto-mocked using jest.mock(moduleName).
  // https://facebook.github.io/jest/docs/en/configuration.html#automock-boolean
  automock: false, // [boolean]

  // Respect Browserify's "browser" field in package.json when resolving modules.
  // https://facebook.github.io/jest/docs/en/configuration.html#browser-boolean
  browser: false, // [boolean]

  // This config option can be used here to have Jest stop running tests after the first failure.
  // https://facebook.github.io/jest/docs/en/configuration.html#bail-boolean
  bail: false, // [boolean]

  // The directory where Jest should store its cached dependency information.
  // https://facebook.github.io/jest/docs/en/configuration.html#cachedirectory-string
  // cacheDirectory: '/tmp/<path>', // [string]

  // Indicates whether the coverage information should be collected while executing the test.
  // Because this retrofits all executed files with coverage collection statements,
  // it may significantly slow down your tests.
  // https://facebook.github.io/jest/docs/en/configuration.html#collectcoverage-boolean
  // collectCoverage: false, // [boolean]

  // https://facebook.github.io/jest/docs/en/configuration.html#collectcoveragefrom-array
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  // https://facebook.github.io/jest/docs/en/configuration.html#coveragedirectory-string
  coverageDirectory: '<rootDir>/coverage', // [string]

  // coveragePathIgnorePatterns: // [array<string>]
  // coverageReporters: [], // [array<string>]
  // coverageThreshold: {}, // [object]

  globals: {
    __DEV__: true,
  },

  // https://facebook.github.io/jest/docs/en/configuration.html#mapcoverage-boolean
  // mapCoverage: false, // [boolean]

  // The default extensions Jest will look for.
  // https://facebook.github.io/jest/docs/en/configuration.html#modulefileextensions-array-string
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],

  moduleDirectories: [
    "node_modules"
  ],

  // A map from regular expressions to module names that allow to stub out resources,
  // like images or styles with a single module.
  moduleNameMapper: {
    '\\.(css|less|styl|scss|sass|sss)$': 'identity-obj-proxy',
  },

  // modulePathIgnorePatterns: // [array<string>]
  // modulePaths: // [array<string>]
  // notify: false, // [boolean]
  // preset: // [string]
  // projects: // [array<string>]
  // clearMocks: // [boolean]
  // reporters: // [array<moduleName | [moduleName, options]>]
  // resetMocks: // [boolean]
  // resetModules: // [boolean]
  // resolver: // [string]
  // rootDir: // [string]
  // roots: // [array<string>]
  // setupFiles: // [array]
  // setupTestFrameworkScriptFile: // [string]
  // snapshotSerializers: // [array<string>]
  testEnvironment: 'node',
  // testMatch: // [array<string>]
  // testPathIgnorePatterns: // [array<string>]
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  // testResultsProcessor: // [string]
  // testRunner: // [string]
  // testURL: // [string]
  // timers: // [string]

  transform: {
    '\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
    '\\.(gql|graphql)$': '<rootDir>/tools/lib/gqlTransformer.js',
    '\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^(?!.*\\.(js|jsx|json|css|less|styl|scss|sass|sss)$)':
      '<rootDir>/tools/lib/fileTransformer.js',
    '.*': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },

  // transformIgnorePatterns: // [array<string>]
  // unmockedModulePathPatterns: // [array<string>]

  // verbose: true, // [boolean]

  globals: {
    'ts-jest': {
      babelConfig: {
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
        ],
      },
    }
  }
};