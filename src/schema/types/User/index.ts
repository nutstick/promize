import { IAddress } from '../../models/User/address';
import { IPaymentMethod } from '../../models/User/paymentmethod';
import { IOrderReceipt } from '../OrderReceipt';
import { INode, IPage } from '../Pagination';
import { IProduct } from '../Product/index';
import resolver from './resolver';
import * as type from './typeDef.gql';

interface IAccount {
  email: string;
}

interface IUserType {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  telNumber: string;
  account?: IAccount;
  addresses?: IAddress[];
  paymentMethods?: IPaymentMethod[];
  avatar?: string;
  orderReceipts?: IOrderReceipt[];
  createAt?: Date;
  updateAt?: Date;
}

interface IUser extends IUserType, INode {}

interface ICoSeller extends IUserType, INode {
  products?: IPage<IProduct>;
  buyOrderReceipts?: IOrderReceipt[];
}

export {
  resolver,
  type,
  IUser,
  ICoSeller,
};
