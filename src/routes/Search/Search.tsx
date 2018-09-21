import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import * as FaFilterIcon from 'react-icons/lib/fa/filter';
import * as MdSortIcon from 'react-icons/lib/md/sort';
import { RouteComponentProps } from 'react-router';
import * as sizeMe from 'react-sizeme';
import StackGrid, { easings, transitions } from 'react-stack-grid';
import * as Waypoint from 'react-waypoint';
import { Checkbox, Loader, Radio, Sticky } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { Card, contentClass, headingClass } from '../../components/Card';
import { ProductCard } from '../../components/ProductCard';
import { parseSearch } from '../../core/urlParser';
import { IPage } from '../../schema/types/Pagination';
import { IProduct } from '../../schema/types/Product';
import * as NoResultImage from './no-results.png';
import * as s from './Search.css';
import * as SEARCHQUERY from './SearchQuery.gql';

const transition = transitions.scaleDown;

namespace Search {
  export interface SearchQuery {
    search: IPage<IProduct>;
  }

  export type WithRouter = {
    size?: {
      width?: number,
      height?: number,
      position?: number,
    };
  } & RouteComponentProps<{}>;

  export type Props = ChildProps<WithRouter, SearchQuery>;

  export interface State {
    rendered: boolean;
  }
}

@withStyles(s)
@sizeMe()
@graphql<Search.WithRouter, Search.SearchQuery>(SEARCHQUERY, {
  options(props) {
    return {
      variables: {
        keywords: parseSearch(props.location),
        after: null,
        first: 20,
      },
    };
  },
})
export class Search extends React.Component<Search.Props> {
  constructor(props) {
    super(props);
    this.state = {
      rendered: false,
    };
  }

  public componentDidMount() {
    document.title = 'Results';
  }

  public render() {
    return (
      <div className={s.root}>
        <Card className={s.results}>
          {
            this.props.data.loading ? <Loader active /> :
            this.props.data.error ? this.props.data.error :
            this.props.data.search && this.props.data.search.totalCount === 0 ?
            <div className={s.notFound}>
              <img src={NoResultImage} alt="No Results founds." />
              <span className={s.text}>No Results found.</span>
            </div> :
            this.props.data.search && <div className={cx(contentClass, s.productList)}>
              <StackGrid
                columnWidth={this.props.size.width <= 425 ? '100%' : 180}
                gutterWidth={5}
                gutterHeight={5}
              >
                {this.props.data.search.edges.map((product) => (
                  <ProductCard key={`PRODUCT-${product.node._id}`} product={product.node} />
                ))}
                {this.props.data.search.pageInfo.hasNextPage && <Waypoint
                  onEnter={() => {
                    this.props.data.fetchMore({
                      variables: {
                        after: this.props.data.search.pageInfo.endCursor,
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
        </Card>
      </div>
    );
  }
}
