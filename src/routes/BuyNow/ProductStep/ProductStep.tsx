import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps, MutationFunc } from 'react-apollo';
import Slider from 'react-slick';
import { Button, Icon } from 'semantic-ui-react';
import * as slickThemeCss from 'slick-carousel/slick/slick-theme.css';
import * as slickCss from 'slick-carousel/slick/slick.css';
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

  export type WithSelectColorMutation = SelectColorMutation<IProps, {}>;

  type SelectSizeMutation<P, R> = P & {
    selectSizeMutation?: MutationFunc<R>;
  };

  export type WithSelectSizeMutation = SelectSizeMutation<WithSelectColorMutation, {}>;

  export interface ProductQuery {
    product: IProductClient;
  }

  export type Props = ChildProps<WithSelectSizeMutation, ProductQuery>;
}

@withStyles(slickCss, slickThemeCss, s)
@graphql<ProductStep.IProps, {}>(SELECTCOLORMUTATION, {
  name: 'selectColorMutation',
})
@graphql<ProductStep.WithSelectColorMutation, {}>(SELECTSIZEMUTATION, {
  name: 'selectSizeMutation',
})
@graphql<ProductStep.WithSelectSizeMutation, ProductStep.ProductQuery>(PRODUCTQUERY, {
  options({ id }) {
    return { variables: { id } };
  },
})
export class ProductStep extends React.Component<ProductStep.Props> {
  slider?: any;

  private next() {
    this.slider.slickNext();
  }

  private previous() {
    this.slider.slickPrev();
  }

  public render() {
    const PrevArrow = () => (<div
      className={cx(s.arrow, s['--left'])}
      onClick={this.previous.bind(this)}>
      <Icon color="grey" size="large" name="chevron left" />
    </div>);

    const NextArrow = () => (<div
      className={cx(s.arrow, s['--right'])}
      onClick={this.next.bind(this)}>
      <Icon color="grey" size="large" name="chevron right" />
    </div>);

    const { product } = this.props.data;

    return (
      <div className={s.root}>
        <div className={s.productImage}>
          <Slider
            ref={(c) => { this.slider = c; }}
            nextArrow={<NextArrow />}
            prevArrow={<PrevArrow />}
            dots={true}
            dotsClass={s.dot}
            infinite={true}>
            {product.pictures.map((pic, index) => (
              <div className={s.pictureWrapper}>
                <img key={`Product-${product._id}-picture-${index}`} className={s.image} src={pic} />
              </div>
            ))}
          </Slider>
        </div>
        <div className={s.side}>
          <div className={s.productName}>
            Product: {product.name}
          </div>
          <div className={s.productDescription}>
            {product.description}
          </div>
          {/* Size options */}
          <div className={s.block}>
            <span className={s.label}>Size:</span>
            <ItemSelector
              options={product.sizes.map((size) => ({
                value: size._id,
                text: size.size,
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
                value: color._id,
                text: color.color,
              }))}
              selected={product.selectedColor}
              onChange={(_, color) => this.props.selectColorMutation({
                variables: { id: product._id, color },
              })}
            />
          </div>
          <div className={s.block}>
            <div className={s.label}>
              Price: {product.price}
            </div>
          </div>
          <div className={s.buttons}>
            <Button
              className={s.right}
              color="orange"
              content="Next"
              disabled={!product.selectedSize || !product.selectedColor}
              onClick={this.props.next} />
          </div>
        </div>
      </div>
    );
  }
}
