import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { IProduct } from '../../schema/types/Product';
import * as s from './ProductCard.css';

export namespace ProductCard {
  interface IProps {
    product: IProduct;
  }
  export type Props = IProps;
}

@withStyles(s)
export class ProductCard extends React.Component<ProductCard.Props> {
  private ownerName(owner) {
    if (owner.middleName) {
      return `${this.props.product.owner.firstName} ` +
        `${this.props.product.owner.middleName}` +
        `${this.props.product.owner.lastName}`;
    }
    return `${this.props.product.owner.firstName} ` +
      `${this.props.product.owner.lastName}`;
  }
  public render() {
    return (
      <figure
        className={s.root}
        key={this.props.product._id}
      >
        <img src={this.props.product.picture[0]} alt={this.props.product.name} />
        <div className={s.content}>
          <div className={s.header}>{this.props.product.name}</div>
          <div className={s.owner}>
            <Link to={`/search?keyword=${this.props.product.owner._id}`}>
              {this.ownerName(this.props.product.owner)}
            </Link>
          </div>
          <div className={s.description}>
            {this.props.product.description}
          </div>
        </div>
      </figure>
    );
  }
}
