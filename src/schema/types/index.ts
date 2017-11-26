import { Database } from '../models';

export interface IContext {
  database: Database;
  user?: {
    _id?: string,
  };
}

type ResolverFn<R, A> = (root?: R, args?: A, context?: IContext) => any;

export interface IResolver<R, A> {
  [key: string]: {
    [key: string]: ResolverFn<R, A>,
    __resolveType?: (root?, context?, info?) => string,
  };
}

export interface ISubsciption {
  [key: string]: {
    [key: string]: any;
  };
}
