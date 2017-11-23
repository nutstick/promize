import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps, MutationFunc } from 'react-apollo';
import { Button, Card, Icon } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import * as TOGGLELOGINMODALMUTATION from '../../../apollo/login/ToggleLoginModalMutation.gql';
import { IProductClient } from '../../../apollo/product';
import { IUser } from '../../../schema/types/User';
import { PaymentMethodOption } from '../PaymentMethodStep';
import * as PRODUCTQUERY from '../ProductStep/ProductQuery.gql';
import { AddressOption } from '../ShippingStep';
import * as ADDRESSQUERY from './AddressQuery.gql';
import * as CREATEORDERRECIEPTMUTATION from './CreateOrderReceiptMutation.gql';
import * as PAYMENTMETHODQUERY from './PaymentMethodQuery.gql';
import * as s from './Review.css';

export namespace Review {
  export interface IProps {
    id: string;

    me?: IUser;

    address?: string;
    city?: string;
    country?: string;
    zip?: string;
    addressLoading?: boolean;

    userAddress?: string;

    creditCardNumber?: string;
    validFromMonth?: string;
    validFromYear?: string;
    creditCardLoading?: boolean;

    userPaymentMethod?: string;
    prev: (e) => void;
  }

  export interface UserQuery {
    me: IUser;
  }

  export type WrapWithAddressQuery = IProps;

  export type WrapWithPaymentMethodQuery = IProps;

  export interface ProductQuery {
    product: IProductClient;
  }

  export type WrapWithProductQuery = ChildProps<WrapWithPaymentMethodQuery, ProductQuery>;

  type ToggleLoginModalMutation<P, R> = P & {
    loginModal?: MutationFunc<R>;
  };

  export type WrapWithToggleLoginMutation = ToggleLoginModalMutation<WrapWithProductQuery, {}>;

  type CreateOrderReceiptMutation<P, R> = P & {
    orderReceipt?: MutationFunc<R>;
  };

  export type Props = CreateOrderReceiptMutation<WrapWithToggleLoginMutation, {}>;
}

@withStyles(s)
@graphql<Review.IProps, Review.UserQuery>(ADDRESSQUERY, {
  options(props) {
    return {
      variables: {
        id: props.userAddress,
      },
    };
  },
  props(props) {
    return {
      ...props.ownProps,
      addressLoading: props.data.loading,
      ...props.data.me && props.data.me.address && {
        address: props.data.me.address.address,
        city: props.data.me.address.city,
        country: props.data.me.address.country,
        zip: props.data.me.address.zip,
      },
    };
  },
})
@graphql<Review.WrapWithAddressQuery, Review.UserQuery>(PAYMENTMETHODQUERY, {
  options(props) {
    return {
      variables: {
        id: props.userPaymentMethod,
      },
    };
  },
  props(props) {
    return {
      ...props.ownProps,
      me: props.data.me,
      creditCardLoading: props.data.loading,
      ...props.data.me && props.data.me.paymentMethod && {
        creditCardNumber: props.data.me.paymentMethod.creditCardNumber,
      },
    };
  },
})
@graphql<Review.WrapWithPaymentMethodQuery, Review.ProductQuery>(PRODUCTQUERY, {
  options({ id }) {
    return { variables: { id } };
  },
})
@graphql<Review.WrapWithProductQuery, {}>(TOGGLELOGINMODALMUTATION, {
  name: 'loginModal',
})
@graphql<Review.WrapWithToggleLoginMutation, {}>(CREATEORDERRECIEPTMUTATION, {
  name: 'orderReceipt',
})
export class Review extends React.Component<Review.Props> {
  public render() {
    const { product } = this.props.data;
    const { address, country, city, zip } = this.props;
    const { creditCardNumber, validFromMonth, validFromYear } = this.props;

    return (
      <div className={s.root}>
        {/* Product */}
        <div className={cx(s.product, s.block)}>
          <div className={s.productName}>{product.name}</div>
          {/* Size options */}
          <div>
            <span className={s.label}>Size:</span>
            {
              product.sizes.filter((size) => (size._id === product.selectedSize))
              .map((size) => (
                <div>{size.size}</div>
              ))
            }
          </div>
          {/* Color options */}
          <div>
            {/* TODO: Fixed css */}
            <span className={s.label}>Color:</span>
            {
              product.colors.filter((color) => (color._id === product.selectedColor))
              .map((color) => (
                <div>{color.color}</div>
              ))
            }
          </div>
        </div>

        <hr />

        {/* Address */}
        <div className={cx(s.address, s.block)}>
          <div className={s.h}>
            <span className={s.header}>Delivery Address</span>
            <span className={s.meta}>Your select delivery address.</span>
          </div>
          <Card>
            <Card.Content>
              <Card.Header>{address}</Card.Header>
              <Card.Description>
                {city}, {country}, {zip}
              </Card.Description>
            </Card.Content>
          </Card>
        </div>

        <hr />

        {/* Payment Method */}
        <div className={s.block}>
          <div className={s.h}>
            <span className={s.header}>Payment Method</span>
            <span className={s.meta}>Your select payment method.</span>
          </div>
          <PaymentMethodOption creditCardNumber={this.props.creditCardNumber} />
        </div>
        <div className={s.buttons}>
          <Button
            className={s.left}
            content="Previous"
            onClick={this.props.prev} />
          {
            this.props.me ? <Button
              className={s.right}
              color="orange"
              onClick={() => this.props.orderReceipt({
                variables: {
                  input: {
                    product: this.props.id,
                    size: product.selectedSize,
                    color: product.selectedColor,
                    deliverAddress: this.props.userAddress || {
                      address,
                      city,
                      country,
                      zip,
                    },
                    paymentMethod: this.props.userPaymentMethod || {
                      creditCardNumber,
                      validFromMonth,
                      validFromYear,
                    },
                    // TODO: remark
                  },
                },
              })}>
              <Icon name="shop" /> Confirm Order
            </Button> : <Button
              className={s.right}
              color="orange"
              onClick={() => this.props.loginModal({})}>
              <Icon name="lock" /> Login to continue
            </Button>
          }
        </div>
      </div>
    );
  }
}
