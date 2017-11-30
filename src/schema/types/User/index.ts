import { IAddress } from '../../models/User/address';
import { IOrderReceipt } from '../OrderReceipt';
import { INode, IPage } from '../Pagination';
import { IProduct } from '../Product/index';
import { ITradeRoom } from '../Traderoom';
import resolver from './resolver';
import * as type from './typeDef.gql';

export interface IPaymentMethod {
  _id?: string;
  creditCardNumber?: string;
}

export interface IAccount {
  email?: string;
  facebookAccessCode?: string;
  googleAccessCode?: string;
}

export interface IUserType {
  _id?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  telNumber: string;
  account?: IAccount;

  address?: IAddress;
  addresses?: IAddress[];

  paymentMethod?: IPaymentMethod;
  paymentMethods?: IPaymentMethod[];

  citizenCardImage: string;

  avatar?: string;
  orderReceipts?: IPage<IOrderReceipt>;
  createAt?: Date;
  updateAt?: Date;

  traderooms: ITradeRoom[];
  traderoom: ITradeRoom;

  __typename: string;
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

interface IAdmin extends IUserType, INode {
  admin?: boolean;
  pendingCoSellers: ICoSeller[];
}

export {
  resolver,
  type,
  IAdmin,
  IUser,
  ICoSeller,
};
