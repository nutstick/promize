import withStyles from 'isomorphic-style-loader/lib/withStyles';
// external-global styles must be imported in your JS.
import * as normalizeCss from 'normalize.css';
import * as React from 'react';
import { QueryProps } from 'react-apollo';
import * as semanticsCss from 'semantic-ui-css/semantic.min.css';
import { graphql } from '../../apollo/graphql';

import { LoginQuery } from '../../apollo/login';
import * as LOGINQUERY from '../../apollo/login/LoginQuery.gql';

import { ProductModalQuery } from '../../apollo/productModal';
import * as PRODUCTMODALQUERY from '../../apollo/productModal/ProductModalQuery.gql';

import { Footer } from '../Footer';
import { Header } from '../Header';
import { LoginModal } from '../LoginModal';
import { Main } from '../Main';
import { ProductModal } from '../ProductModal';
import * as s from './Layout.css';

namespace Layout {
  type LoginProps<P, R> = P & {
    login?: QueryProps & Partial<R>;
  };

  export type WrapWithLoginQuery = LoginProps<{}, LoginQuery>;

  type ProductModalProps<P, R> = P & {
    productModal?: QueryProps & Partial<R>;
  };

  export type Props = ProductModalProps<WrapWithLoginQuery, ProductModalQuery>;
}

@withStyles(normalizeCss, semanticsCss, s)
@graphql<{}, LoginQuery>(LOGINQUERY, { name: 'login' })
@graphql<Layout.WrapWithLoginQuery, ProductModalQuery>(PRODUCTMODALQUERY, { name: 'productModal' })
export class Layout extends React.Component<Layout.Props> {
  public render() {
    return (
      <div>
        {this.props.productModal.productModal && this.props.productModal.productModal.show &&
          <ProductModal id={this.props.productModal.productModal.id}/>}
        {this.props.login.login && this.props.login.login.modal && <LoginModal />}
        <Header />
        <Main>
          {this.props.children}
        </Main>
        <Footer />
      </div>
    );
  }
}
