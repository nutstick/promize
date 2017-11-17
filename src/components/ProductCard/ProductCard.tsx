import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { graphql } from '../../apollo/graphql';
import * as OPENPRODUCTMODALMUTATION from '../../apollo/productModal/OpenProductModalMutation.gql';
import { IProduct } from '../../schema/types/Product';
import * as s from './ProductCard.css';

export namespace ProductCard {
  export interface IProps {
    product: IProduct;
  }
  export type Props = ChildProps<IProps, {}>;
}

@withStyles(s)
@graphql<ProductCard.IProps, {}>(OPENPRODUCTMODALMUTATION, {
  options(props) {
    return {
      variables: {
        id: props.product._id,
      },
    };
  },
})
export class ProductCard extends React.Component<ProductCard.Props> {
  private ownerName(owner) {
    if (owner.middleName) {
      return `${owner.firstName} ` +
        `${owner.middleName}` +
        `${owner.lastName}`;
    }
    return `${owner.firstName} ` +
      `${owner.lastName}`;
  }
  public render() {
    return (
      <figure
        className={s.root}
        key={this.props.product._id}
        onClick={(e) => { this.props.mutate({}); }}
      >
        <img src={this.props.product.picture[0]} alt={this.props.product.name} />
        <div className={s.content}>
          <div className={s.header}>{this.props.product.name}</div>
          <div className={s.owner}>
            {this.ownerName(this.props.product.owner)}
          </div>
          <div className={s.description}>
            {this.props.product.description}
          </div>
        </div>
      </figure>
    );
  }
}
