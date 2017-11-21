import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps, MutationFunc } from 'react-apollo';
import { Button, Image } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { IProductClient } from '../../../apollo/product';
import * as SELECTCOLORMUTATION from '../../../apollo/product/SelectColorMutation.gql';
import * as SELECTSIZEMUTATION from '../../../apollo/product/SelectSizeMutation.gql';
import { ItemSelector } from '../../../components/ItemSelector';
import * as PRODUCTQUERY from './ProductQuery.gql';
import * as s from './ProductStep.css';

export namespace ProductStep {
  export interface IProps {
    id: string;
    next: (e) => void;
  }

  type SelectColorMutation<P, R> = P & {
    selectColorMutation?: MutationFunc<R>;
  };

  export type WrapWithSelectColorMutation = SelectColorMutation<IProps, {}>;

  type SelectSizeMutation<P, R> = P & {
    selectSizeMutation?: MutationFunc<R>;
  };

  export type WrapWithSelectSizeMutation = SelectSizeMutation<WrapWithSelectColorMutation, {}>;

  export interface ProductQuery {
    product: IProductClient;
  }

  export type Props = ChildProps<WrapWithSelectSizeMutation, ProductQuery>;
}

@withStyles(s)
@graphql<ProductStep.IProps, {}>(SELECTCOLORMUTATION, {
  name: 'selectColorMutation',
})
@graphql<ProductStep.WrapWithSelectColorMutation, {}>(SELECTSIZEMUTATION, {
  name: 'selectSizeMutation',
})
@graphql<ProductStep.WrapWithSelectSizeMutation, ProductStep.ProductQuery>(PRODUCTQUERY, {
  options({ id }) {
    return { variables: { id } };
  },
})
export class ProductStep extends React.Component<ProductStep.Props> {
  public render() {
    const { product } = this.props.data;
    return (
      <div className={s.root}>
        <div>{product.name}</div>
        <div>{product.description}</div>
        <div>
          {product.pictures.map((picture, index) => (
            <Image key={index} src={picture} />
          ))}
        </div>
        {/* Size options */}
        <div className={s.block}>
          <span className={s.label}>Size:</span>
          <ItemSelector
            options={product.sizes.map((size) => ({
              value: size,
              text: size,
            }))}
            selected={product.selectedSize}
            onChange={(_, size) => this.props.selectSizeMutation({
              variables: { id: product._id, size },
            })}
          />
        </div>
        {/* Color options */}
        <div className={s.block}>
          {/* TODO: Fixed css */}
          <span className={s.label}>Color:</span>
          <ItemSelector
            options={product.colors.map((color) => ({
              value: color,
              text: color,
            }))}
            selected={product.selectedColor}
            onChange={(_, color) => this.props.selectColorMutation({
              variables: { id: product._id, color },
            })}
          />
        </div>
        <div>
          <Button
            className={s.right}
            color="orange"
            content="Next"
            disabled={!product.selectedSize || !product.selectedColor}
            onClick={this.props.next} />
        </div>
      </div>
    );
  }
}
