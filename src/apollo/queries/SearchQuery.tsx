import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { IPage } from 'schema/types/Pagination';
import { IProduct } from 'schema/types/Product';

export const query = gql`
query ($first: Int, $after: ID) {
  search(first: $first, after: $after) {
    edges {
      node {
        _id
        name
      }
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
`;

interface Data {
  search: IPage<IProduct>;
}

interface Variables {
  first?: number;
  after?: string;
}

export class SearchQuery extends Query<Data, Variables> {}
