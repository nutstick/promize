import withStyles from 'isomorphic-style-loader/lib/withStyles';
// external-global styles must be imported in your JS.
import * as normalizeCss from 'normalize.css';
import * as React from 'react';
import * as semanticsCss from 'semantic-ui-css/semantic.min.css';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Main } from '../Main';

import * as s from './Layout.css';

namespace Layout {
  export type Props = any;
}

@withStyles(normalizeCss, semanticsCss, s)
export class Layout extends React.Component<Layout.Props> {
  public render() {
    return (
      <div>
        <Header />
        <Main>
          {this.props.children}
        </Main>
        <Footer />
      </div>
    );
  }
}
