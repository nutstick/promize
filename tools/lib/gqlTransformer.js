const gql = require('graphql-tag');
const loader = require('graphql-tag/loader');

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/tutorial-webpack.html
module.exports = {
  process(src) {
    return loader.call({ cacheable() {} }, src);
  },
};