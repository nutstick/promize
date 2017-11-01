/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { cleanDir } from './lib/fs';

/**
 * Cleans up the output (dist) directory.
 */
function clean() {
  return Promise.all([
    cleanDir('dist/*', {
      nosort: true,
      dot: true,
      ignore: ['dist/.git', 'dist/public'],
    }),

    cleanDir('dist/public/*', {
      nosort: true,
      dot: true,
      ignore: ['dist/public/.git'],
    }),
  ]);
}

export default clean;