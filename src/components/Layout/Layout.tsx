import withStyles from 'isomorphic-style-loader/lib/withStyles';
// external-global styles must be imported in your JS.
import * as normalizeCss from 'normalize.css';
import * as React from 'react';
import { Header } from '../Header';
import { Main } from '../Main';

import * as s from './Layout.css';

// TODO not using required
// tslint:disable-next-line:no-var-requires
// const MdAdd = require('react-icons/lib/md/add');

namespace Layout {
  export type Props = any;
}

@withStyles(normalizeCss, s)
export class Layout extends React.Component<Layout.Props> {
  public render() {
    return (
      <div>
        <Header />
        <Main>
          {this.props.children}
        </Main>
      </div>
    );
  }
}
