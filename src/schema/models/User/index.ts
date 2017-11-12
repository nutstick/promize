import * as Iridium from 'iridium';
import { Collection, Index, Instance, ObjectID, Property } from 'iridium';
import { Account, IAccountDocument } from './account';
import { Address, IAddress } from './address';
import { IPaymentMethod, PaymentMethod } from './paymentmethod';

interface IUserDocument {
  _id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  tel_number?: string;
  account: IAccountDocument;
  addresses?: IAddress[];
  payment_methods?: IPaymentMethod[];
  avatar: string;
  createAt?: Date;
  updateAt?: Date;
}

@Index({
  'account.email': 1,
  'account.facebookAccessCode': 1,
  'account.googleAccessCode': 1,
}, { unique: true })
@Collection('users')
class User extends Instance<IUserDocument, User> implements IUserDocument {
  @ObjectID
  _id: string;
  @Property(/^.+$/, true)
  first_name: string;
  @Property(/^.+$/, false)
  middle_name: string;
  @Property(/^.+$/, true)
  last_name: string;

  @Property(/^[0-9-]+$/, false)
  tel_number: string;

  @Property(Account, true)
  account: IAccountDocument;
  @Property(Address, false)
  address: IAddress;
  @Property(PaymentMethod, false)
  payment_method: IPaymentMethod;

  @Property(String, true)
  avatar: string;
  @Property(Date, false)
  createAt: Date;
  @Property(Date, false)
  updateAt: Date;

  static onCreating(user: IUserDocument) {
    user.addresses = [];
    user.payment_methods = [];
    user.createAt = new Date();
    user.updateAt = new Date();

    if (!user.account.facebook && !user.account.password) {
      return Promise.reject(new Error('expected one login method'));
    }
  }

  static onSaving(user: User, changes: Iridium.Changes) {
    user.updateAt = new Date();
  }
}

export { IUserDocument, User };
