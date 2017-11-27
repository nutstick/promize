import { IAddress } from '../../models/User/address';
import { IOrderReceipt } from '../OrderReceipt';
import { INode, IPage } from '../Pagination';
import { IProduct } from '../Product/index';
import resolver from './resolver';
import * as type from './typeDef.gql';

export interface IPaymentMethod {
  _id?: string;
  creditCardNumber?: string;
  validFromMonth?: number;
  validFromYear?: number;
}

export interface IAccount {
  email?: string;
  facebookAccessCode?: string;
  googleAccessCode?: string;
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
  orderReceipts?: IPage<IOrderReceipt>;
  createAt?: Date;
  updateAt?: Date;
}

export enum CoSellerRegisterStatus {
  CLOSE,
  SEND,
  APPROVING,
  APPROVED,
}

interface IUser extends IUserType, INode {
  coSellerRegisterStatus: CoSellerRegisterStatus;
}

interface ICoSeller extends IUserType, INode {
  coseller?: boolean;
  products?: IPage<IProduct>;
  buyOrderReceipts?: IPage<IOrderReceipt>;
  totalBuyOrderReceipts?: number;
}

export {
  resolver,
  type,
  IUser,
  ICoSeller,
};
