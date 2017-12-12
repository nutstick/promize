import resolver from './resolver';
import * as type from './typeDef.gql';

type Direction = 'ASC' | 'DESC';

interface INode {
  _id?: string;
}

interface IPageInfo {
  endCursor?: string;
  hasNextPage?: boolean;
}

interface IEdge<T> {
  node: T;
  cursor: string;
}

interface IPage<T> {
  totalCount?: number;
  edges: Array<IEdge<T>>;
  pageInfo: IPageInfo;
}

export {
  resolver,
  type,
  INode,
  IEdge,
  IPage,
  Direction,
};
