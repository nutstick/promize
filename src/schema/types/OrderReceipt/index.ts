import { IColor, ISize } from '../../models/Product/productdetail';
import { IAddress } from '../../models/User/address';
import { IPaymentMethod } from '../../models/User/paymentmethod';
import { INode } from '../Pagination';
import { IProduct } from '../Product';
import { IUser } from '../User';
import resolver from './resolver';
import * as type from './typeDef.gql';

interface IOrderReceipt extends INode {
  product: IProduct;
  creator: IUser;

  size: ISize;
  color: IColor;
  numberOfItems: number;

  deliverAddress?: IAddress;
  trackingId?: string;
  remark?: string;

  createAt: Date;

  paymentMethod?: IPaymentMethod;
  paymentCompletedAt?: Date;
  paymentCompleted?: boolean;

  productDeliveredAt?: Date;
  productDelivered?: boolean;

  productReceivedAt?: Date;
  productReceived?: boolean;
}

export {
  resolver,
  type,
  IOrderReceipt,
};
