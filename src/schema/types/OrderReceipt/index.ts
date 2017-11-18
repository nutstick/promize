import { INode } from '../Pagination';
import { IProduct } from '../Product';
import { IUser } from '../User';
import resolver from './resolver';
import * as type from './typeDef.gql';

interface IOrderReceipt extends INode {
  product?: IProduct;
  creator?: IUser;
  // TODO: Add require fields
  createAt?: Date;
  updateAt?: Date;
}

export {
  resolver,
  type,
  IOrderReceipt,
};
