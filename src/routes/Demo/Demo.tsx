import { query, SearchQuery } from 'apollo/queries/SearchQuery';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Card } from '../../components/Card';
import * as s from './Demo.css';

@withStyles(s)
export class Demo extends React.Component<{}> {
  render() {
    return (
      <div className={s.root}>
        <Card className={s.results}>
          <SearchQuery query={query} variables={{ first: 10, after: null }}>
            {({ data, loading, fetchMore }) => {
              if (loading) {
                return 'loading';
              }
              if (data) {
                return <div>
                  {data.search.edges.map(({ node: { _id, name } }) => {
                    return <div key={_id}>{name}</div>;
                  })}
                  <button onClick={() => {
                    fetchMore({
                      updateQuery(prev, { fetchMoreResult }) {
                        if (prev.search.edges.length === 0) {
                          return {
                            search: {
                              ...fetchMoreResult.search,
                              edges: fetchMoreResult.search.edges,
                            },
                          };
                        }
                        return {
                          search: {
                            ...fetchMoreResult.search,
                            edges: prev.search.edges.concat(fetchMoreResult.search.edges),
                          },
                        };
                      },
                      variables: {
                        after: data.search.pageInfo.endCursor,
                      },
                    });
                  }}>Load more</button>
                </div>;
              }
              return null;
            }}
          </SearchQuery>
        </Card>
      </div>
    );
  }
}
