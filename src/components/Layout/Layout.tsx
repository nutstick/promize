import withStyles from 'isomorphic-style-loader/lib/withStyles';
// external-global styles must be imported in your JS.
import * as normalizeCss from 'normalize.css';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import * as semanticsCss from 'semantic-ui-css/semantic.min.css';
import { graphql } from '../../apollo/graphql';
import { LoginQuery } from '../../apollo/login';
import * as LOGINQUERY from '../../apollo/login/LoginQuery.gql';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { LoginModal } from '../LoginModal';
import { Main } from '../Main';
import * as s from './Layout.css';

namespace Layout {
  export type Props = ChildProps<{}, LoginQuery>;
}

@withStyles(normalizeCss, semanticsCss, s)
@graphql<{}, LoginQuery>(LOGINQUERY)
export class Layout extends React.Component<Layout.Props> {
  public render() {
    return (
      <div>
        {this.props.data.login && this.props.data.login.modal && <LoginModal />}
        <Header />
        <Main>
          {this.props.children}
        </Main>
        <Footer />
      </div>
    );
  }
}
