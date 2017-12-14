import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { Link, RouteComponentProps } from 'react-router-dom';
import { sizeMe } from 'react-sizeme';
import StackGrid, { easings, transitions } from 'react-stack-grid';
import * as Waypoint from 'react-waypoint';
import { Button, Loader } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { contentClass } from '../../../components/Card';
import { ProductCard } from '../../../components/ProductCard';
import { IPage } from '../../../schema/types/Pagination';
import { IProduct } from '../../../schema/types/Product';
import * as NoResultImage from '../../Search/no-results.png';
import * as s from './Products.css';
import * as PRODUCTSQUERY from './ProductsQuery.gql';

const transition = transitions.scaleDown;

namespace Products {
  export type IProps = {
    self?: boolean,
    size?: {
      width?: number,
      height?: number,
      position?: number,
    };
  } & RouteComponentProps<{ id: string }>;

  export interface ProductsQuery {
    user: {
      products: IPage<IProduct>,
    };
  }

  export type WithProductsQuery = ChildProps<IProps, ProductsQuery>;
  export type Props = WithProductsQuery;
}

@withStyles(s)
@sizeMe()
@graphql<Products.IProps, Products.ProductsQuery>(PRODUCTSQUERY, {
  options(props) {
    return {
      variables: {
        id: props.match.params.id,
        after: null,
        first: 20,
      },
      fetchPolicy: 'network-only',
    };
  },
})
export class Products extends React.Component<Products.Props> {
  private grid: any;

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    document.title = 'Products';
  }

  public render() {
    const { user, loading, error } = this.props.data;
    return (
      <div className={s.root}>
        {this.props.self ? <div className={s.header}>
          <h1>My Products</h1>
          <Button as={Link} to={`/users/${this.props.match.params.id}/products/create`}>New Product</Button>
        </div> : <h1 className={s.header}>Products</h1>}
        {
          loading || error ? <div className={s.content} style={{
            position: 'relative',
            height: '4rem',
          }}><Loader active /></div> :
          user && user.products && user.products.totalCount === 0 ?
          <div className={s.notFound}>
            <img src={NoResultImage} alt="No Results founds." />
            <span className={s.text}>No Results found.</span>
          </div> :
          user && user.products && <div className={cx(contentClass, s.productList)}>
            <StackGrid
              gridRef={(grid) => this.grid = grid}
              duration={400}
              columnWidth={this.props.size.width <= 425 ? '100%' : 180}
              gutterWidth={5}
              gutterHeight={5}
              easing={easings.cubicOut}
              appearDelay={60}
              appear={transition.appear}
              appeared={transition.appeared}
              enter={transition.enter}
              entered={transition.entered}
              leaved={transition.leaved}
              enableSSR={false}
              monitorImagesLoaded
            >
              {user.products.edges.map((product) => (
                <ProductCard key={`${product.node._id}`} product={product.node} />
              ))}
              {user.products.pageInfo.hasNextPage && <Waypoint
                onEnter={() => {
                  this.props.data.fetchMore({
                    variables: {
                      after: user.products.pageInfo.endCursor,
                    },
                    updateQuery(previousResult, { fetchMoreResult }) {
                      const newEdges = fetchMoreResult.search.edges;
                      const pageInfo = fetchMoreResult.search.pageInfo;
                      return newEdges.length ? {
                        // Put the new comments at the end of the list and update `pageInfo`
                        // so we have the new `endCursor` and `hasNextPage` values
                        search: {
                          __typename: previousResult.search.__typename,
                          edges: [...previousResult.search.edges, ...newEdges],
                          pageInfo,
                        },
                      } : previousResult;
                    },
                  });
                }}
              />}
            </StackGrid>
          </div>
        }
      </div>
    );
  }
}
