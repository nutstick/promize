import { ICategory, IColor, ISize } from '../../models/Product/productdetail';
import { Direction, INode } from '../Pagination';
import { IUser } from '../User';
import resolver from './resolver';
import * as type from './typeDef.gql';

type IProductSort = 'price' | 'originalPrice' | 'promotionStart' |
  'promotionEnd' | 'createAt' | 'updateAt' | '_id';

interface IProductOrdering {
  sort: IProductSort;
  direction: Direction;
}

interface IProduct extends INode {
  name: string;
  description?: string;

  type: string;
  originalPrice?: number;
  price?: number;

  pictures: string[];
  hashtags: string[];
  colors?: IColor[];
  sizes?: ISize[];
  categories?: ICategory[];

  promotionStart: Date;
  promotionEnd: Date;
  owner: IUser;
}

export {
  resolver,
  type,
  IProduct,
  IProductOrdering,
};
