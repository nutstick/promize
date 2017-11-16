import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import * as FaFilterIcon from 'react-icons/lib/fa/filter';
import * as MdSortIcon from 'react-icons/lib/md/sort';
import { RouteComponentProps, withRouter } from 'react-router';
import StackGrid, { easings, transitions } from 'react-stack-grid';
import { Loader, Sticky } from 'semantic-ui-react';
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

  export type WithRouter = RouteComponentProps<{}>;

  export type Props = ChildProps<WithRouter, SearchQuery>;
}

@withStyles(s)
@graphql<Search.WithRouter, Search.SearchQuery>(SEARCHQUERY, {
  options(props) {
    return {
      variables: {
        keyword: parseSearch(props.location),
      },
    };
  },
})
@(withRouter as any)
export class Search extends React.Component<Search.Props> {
  public componentDidMount() {
    document.title = 'Results';
  }

  public render() {
    return (
      <div className={s.root}>
        <Sticky className={s.left} bottomOffset={0}>
          <Card>
            <div className={headingClass}>
              <FaFilterIcon size={18} style={{
                marginRight: 2.5,
              }} color="#ff9521" />
              <span>Search Filter</span>
            </div>
            <div className={s.content}>
              <span>Shipped From</span>
              <ul>
                <li>Metro Manila</li>
                <li>North Luzon</li>
                <li>South Luzon</li>
                <li>Visayas</li>
              </ul>
              <hr />
              <span>Condition</span>
              <ul>
                <li>New Prodcut</li>
                <li>Buy now</li>
              </ul>
              <hr />
              <span>Price Range</span>
              <ul>
                <li>Min</li>
                <li>Max</li>
              </ul>
            </div>

            <hr />
            <div className={headingClass}>
              <MdSortIcon size={18} style={{
                marginRight: 2.5,
              }} color="#ff9521" />
              <span>Sort</span>
            </div>
            <div className={s.content}>
            </div>
          </Card>
        </Sticky>
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
                monitorImagesLoaded
                duration={600}
                columnWidth={180}
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
              >
                {this.props.data.search.edges.map((product) => (
                  <ProductCard key={`PRODUCT-${product.node._id}`} product={product.node} />
                ))}
              </StackGrid>
            </div>
          }
        </Card>
      </div>
    );
  }
}
