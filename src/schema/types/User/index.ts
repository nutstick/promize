import { IAddress } from '../../models/User/address';
import { IOrderReceipt } from '../OrderReceipt';
import { INode, IPage } from '../Pagination';
import { IProduct } from '../Product/index';
import resolver from './resolver';
import * as type from './typeDef.gql';

export interface IPaymentMethod {
  _id?: string;
  creditCardNumber?: string;
}

interface IAccount {
  email: string;
}

interface IUserType {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  telNumber: string;
  account?: IAccount;

  address?: IAddress;
  addresses?: IAddress[];

  paymentMethod?: IPaymentMethod;
  paymentMethods?: IPaymentMethod[];

  avatar?: string;
  orderReceipts?: IOrderReceipt[];
  createAt?: Date;
  updateAt?: Date;
}

interface IUser extends IUserType, INode {}

interface ICoSeller extends IUserType, INode {
  coseller?: boolean;
  products?: IPage<IProduct>;
  buyOrderReceipts?: IOrderReceipt[];
}

export {
  resolver,
  type,
  IUser,
  ICoSeller,
};
