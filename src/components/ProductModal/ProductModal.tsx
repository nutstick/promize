import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps, MutationFunc } from 'react-apollo';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { Button, Icon, Loader } from 'semantic-ui-react';
import * as slickThemeCss from 'slick-carousel/slick/slick-theme.css';
import * as slickCss from 'slick-carousel/slick/slick.css';
import { graphql } from '../../apollo/graphql';
import * as TOGGLELOGINMODALMUTATION from '../../apollo/login/ToggleLoginModalMutation.gql';
import { IProductClient } from '../../apollo/product';
import * as SELECTCOLORMUTATION from '../../apollo/product/SelectColorMutation.gql';
import * as SELECTSIZEMUTATION from '../../apollo/product/SelectSizeMutation.gql';
import * as CLOSEPRODUCTMODALMUTATION from '../../apollo/productModal/CloseProductModalMutation.gql';
import * as SETTRADEROOMMODALMUTATION from '../../apollo/tradeRoomModal/SetTradeRoomModal.gql';
import { ItemSelector } from '../ItemSelector';
import * as CREATETRADEROOMMUTATAION from './CreateTradeRoomMutation.gql';
import * as s from './ProductModal.css';
import * as PRODUCTQUERY from './ProductQuery.gql';

namespace ProductModal {
  interface IProps {
    id: string;
  }

  type CloseProductModalMutation<P, R> = P & {
    closeProductModal?: MutationFunc<R>;
  };

  export type WithCloseProductModalMutation = CloseProductModalMutation<IProps, {}>;

  type SelectColorMutation<P, R> = P & {
    selectColorMutation?: MutationFunc<R>;
  };

  export type WithSelectColorMutation = SelectColorMutation<WithCloseProductModalMutation, {}>;

  type SelectSizeMutation<P, R> = P & {
    selectSizeMutation?: MutationFunc<R>;
  };

  export type WithSelectSizeMutation = SelectSizeMutation<WithSelectColorMutation, {}>;

  type ToggleLoginModalMutation<P, R> = P & {
    toggleLoginModal?: MutationFunc<R>;
  };

  export type WithToggleLoginModalMutation = ToggleLoginModalMutation<WithSelectSizeMutation, {}>;

  type CreateTradeRoomMutation<P, R> = P & {
    createTradeRoom?: MutationFunc<R>;
  };

  export type WithCreateTradeRoomMutation = CreateTradeRoomMutation<WithToggleLoginModalMutation, {}>;

  type SetTradeRoomModal<P, R> = P & {
    setTradeRoomModal?: MutationFunc<R>;
  };

  export type WithSetTradeRoomModalMutation = SetTradeRoomModal<WithCreateTradeRoomMutation, {}>;

  export interface ProductQuery {
    product: IProductClient;
    me: {
      _id: string;
    };
  }

  export type Props = ChildProps<WithSetTradeRoomModalMutation, ProductQuery>;
}

@withStyles(slickCss, slickThemeCss, s)
@graphql<{}, {}>(CLOSEPRODUCTMODALMUTATION, {
  name: 'closeProductModal',
})
@graphql<{}, {}>(SELECTCOLORMUTATION, {
  name: 'selectColorMutation',
})
@graphql<{}, {}>(SELECTSIZEMUTATION, {
  name: 'selectSizeMutation',
})
@graphql<{}, {}>(TOGGLELOGINMODALMUTATION, {
  name: 'toggleLoginModal',
})
@graphql<{}, {}>(CREATETRADEROOMMUTATAION, {
  name: 'createTradeRoom',
})
@graphql<{}, {}>(SETTRADEROOMMODALMUTATION, {
  name: 'setTradeRoomModal',
})
@graphql<ProductModal.WithCloseProductModalMutation, ProductModal.ProductQuery>(PRODUCTQUERY, {
  options({ id }) {
    return { variables: { id } };
  },
})
export class ProductModal extends React.Component<ProductModal.Props> {
  slider?: any;

  private onBackgroundClick(e: React.MouseEvent<any>) {
    this.props.closeProductModal({});
  }

  private ownerName(owner) {
    if (owner.middleName) {
      return `${owner.firstName} ` +
        `${owner.middleName}` +
        `${owner.lastName}`;
    }
    return `${owner.firstName} ` +
      `${owner.lastName}`;
  }

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

    const { data: { product } } = this.props;
    return (
      <div className={s.root} onClick={this.onBackgroundClick.bind(this)}>
        <div className={s.modal} onClick={(e) => e.stopPropagation()}>
          {
            this.props.data.loading ? <div className={s.loading}>
              <Loader active />
            </div> :
              this.props.data.error ? <div>Error</div> :
                this.props.data.product ?
                  <div className={s.wrapper}>
                    <div className={s.imgContainer}>
                      <Slider
                        ref={(c) => { this.slider = c; }}
                        adaptiveHeight={false}
                        nextArrow={<NextArrow />}
                        prevArrow={<PrevArrow />}
                        dots={true}
                        dotsClass={s.dot}
                        infinite={true}
                        speed={500}
                        slidesToShow={1}
                        slidesToScroll={1}>
                        {product.pictures.map((pic, index) => (
                          <div className={s.pictureWrapper}>
                            <img key={`Product-${product._id}-picture-${index}`} className={s.image} src={pic} />
                          </div>
                        ))}
                      </Slider>
                    </div>
                    <div className={s.contentWrap}>
                      <div className={s.header}>
                        <div>
                          <h2>{product.name}</h2>
                        </div>
                        <div className={s.owner}>
                          <Link
                            className={s.hashtag}
                            onClick={() => this.props.closeProductModal({}) }
                            to={`/users/${product.owner._id}/products`}>
                            {this.ownerName(product.owner)}
                          </Link>
                        </div>
                      </div>
                      <div className={s.content}>
                        <div className={s.textWrapper}>
                          <div className={s.description}>{product.description}</div>
                          <div className={s.hashtags}>
                            {product.hashtags.map((h) =>
                              (<Link to={`/ search ? keyword = ${h}`} className={s.hashtag}>#{h}</Link>),
                            )}
                          </div>
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
                          <div className={s.block}>
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
                        </div>
                      </div>
                      <div className={s.buttonWrapper}>
                        <Button
                          as={Link}
                          to={`/products/${product._id}/buynow`}
                          invert
                          size="small"
                          className={s.primaryButton}
                          onClick={this.onBackgroundClick.bind(this)}
                          animated="vertical">
                          <Button.Content visible>Buy Now</Button.Content>
                          <Button.Content hidden>
                            <Icon name="shopping basket" />
                          </Button.Content>
                        </Button>
                        <Button basic invert size="small" color="orange" animated="vertical"
                          onClick={() => {
                            if (this.props.data.me) {
                              this.props.createTradeRoom({
                                variables: {
                                  input: {
                                    product: this.props.data.product._id,
                                    participants: [this.props.data.product.owner._id, this.props.data.me._id],
                                  },
                                },
                              }).then(({ data }: any) => {
                                this.props.setTradeRoomModal({
                                  variables: {
                                    id: data.createTradeRoom._id,
                                    show: true,
                                  },
                                });
                              });
                            } else {
                              this.props.toggleLoginModal({});
                            }
                          }}>
                          <Button.Content visible>Contact Seller</Button.Content>
                          <Button.Content hidden>
                            <Icon name="talk" />
                          </Button.Content>
                        </Button>
                      </div>
                    </div>
                  </div> :
                  <div>Empty</div>
          }
        </div>
      </div>
    );
  }
}
