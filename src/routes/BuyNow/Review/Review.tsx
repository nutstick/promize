import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { Button, Icon } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
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

    address?: string;
    city?: string;
    country?: string;
    zip?: string;

    userAddress?: string;

    creditCardNumber?: string;
    validFromMonth?: string;
    validFromYear?: string;

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
  export type Props = ChildProps<WrapWithProductQuery, {}>;
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
@graphql<Review.WrapWithProductQuery, {}>(CREATEORDERRECIEPTMUTATION)
export class Review extends React.Component<Review.Props> {
  public render() {
    const { product } = this.props.data;

    const { address, country, city, zip } = this.props;
    return (
      <div className={s.root}>
        {/* Product */}
        <div className={s.product}>
          <div>{product.name}</div>
          {/* Size options */}
          <div className={s.block}>
            <span className={s.label}>Size:</span>
            <div>
              {product.selectedSize}
            </div>
          </div>
          {/* Color options */}
          <div className={s.block}>
            {/* TODO: Fixed css */}
            <span className={s.label}>Color:</span>
            <div>
              {product.selectedColor}
            </div>
          </div>
        </div>

        <hr />

        {/* Address */}
        <div className={s.address}>
          <span className={s.label}>Address:</span>
          <AddressOption address={address} country={country} city={city} zip={zip} />
        </div>

        <hr />

        {/* Payment Method */}
        <div className={s.paymentMethod}>
          <span className={s.label}>Payment Method:</span>
          <PaymentMethodOption creditCardNumber={this.props.creditCardNumber} />
        </div>
        <div>
          <Button
            className={s.left}
            content="Previous"
            onClick={this.props.prev} />
          <Button
            className={s.right}
            color="orange"
            onClick={() => this.props.mutate({
              variables: {
                // TODO: Correct variables
              },
            })}>
            <Icon name="shop" /> Confirm Order
          </Button>
        </div>
      </div>
    );
  }
}
