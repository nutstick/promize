import resolver from './resolver';
import * as type from './typeDef.gql';

interface IAccount {
  email: string;
}

interface IAddress {
  _id?: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
}

interface IPaymentMethod {
  _id?: string;
  creditCardNumber?: string;
}

interface IUser {
  _id?: string;

  firstName?: string;
  middleName?: string;
  lastName?: string;

  telNumber?: string;

  account?: IAccount;

  addresses?: IAddress[];

  paymentMethods?: IPaymentMethod[];

  avatar?: string;

  createAt?: Date;
  updateAt?: Date;
}

export {
  resolver,
  type,
  IUser,
};
