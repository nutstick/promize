import withStyles from 'isomorphic-style-loader/lib/withStyles';
// external-global styles must be imported in your JS.
import * as normalizeCss from 'normalize.css';
import * as React from 'react';
import { QueryProps } from 'react-apollo';
import * as semanticsCss from 'semantic-ui-css/semantic.min.css';
import { Icon } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';

import { LoginQuery } from '../../apollo/login';
import * as LOGINQUERY from '../../apollo/login/LoginQuery.gql';

import { ProductModalQuery } from '../../apollo/productModal';
import * as PRODUCTMODALQUERY from '../../apollo/productModal/ProductModalQuery.gql';

import { TradeRoomModalQuery } from '../../apollo/tradeRoomModal/index';
import * as TRADEROOMMODALQUERY from '../../apollo/tradeRoomModal/TradeRoomModalQuery.gql';
import { BottomFloatingButton } from '../BottomFloatingButton';
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

  export type WithLoginQuery = LoginProps<{}, LoginQuery>;

  type ProductModalProps<P, R> = P & {
    productModal?: QueryProps & Partial<R>;
  };

  export type WithProductModalQuery = ProductModalProps<WithLoginQuery, ProductModalQuery>;

  type TradeRoomModalProps<P, R> = P & {
    tradeRoomModal?: QueryProps & Partial<R>;
  };

  export type WithTradeRoomModal = TradeRoomModalProps<WithProductModalQuery, TradeRoomModalQuery>;

  export type Props = WithTradeRoomModal;
}

@withStyles(normalizeCss, semanticsCss, s)
@graphql<{}, LoginQuery>(LOGINQUERY, { name: 'login' })
@graphql<Layout.WithLoginQuery, ProductModalQuery>(PRODUCTMODALQUERY, { name: 'productModal' })
@graphql<Layout.WithTradeRoomModal, TradeRoomModalQuery>(TRADEROOMMODALQUERY, { name: 'tradeRoomModal' })
export class Layout extends React.Component<Layout.Props> {
  public render() {
    return (
      <div className={s.layout}>
        {this.props.productModal.productModal && this.props.productModal.productModal.show &&
          <ProductModal id={this.props.productModal.productModal.id}/>}
        {this.props.login.login && this.props.login.login.modal && <LoginModal />}
        <Header />
        <Main>
          {this.props.children}
        </Main>
        <Footer />
        <BottomFloatingButton show={this.props.tradeRoomModal.tradeRoomModal.show}>
          <Icon name="comment outline" size="large" />
        </BottomFloatingButton>
      </div>
    );
  }
}
