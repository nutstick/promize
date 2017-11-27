import * as Iridium from 'iridium';
import { Collection, Index, Instance, ObjectID, Property, Transform } from 'iridium';
import { ObjectID as id } from 'mongodb';
import { IProductDocument, Product } from '../Product/index';
import { Account, IAccountDocument } from './account';
import { Address, IAddress } from './address';
import { IPaymentMethod, PaymentMethod } from './paymentmethod';

interface IUserDocument {
  _id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: string;
  tel_number?: string;
  account: IAccountDocument;
  addresses?: IAddress[];
  payment_methods?: IPaymentMethod[];
  avatar: string;
  type?: string;

  coseller_register_status?: string;
  citizen_card_image?: string;

  products?: IProductDocument[];

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
  // Name
  @Property(/^.+$/, true)
  first_name: string;
  @Property(/^.+$/, false)
  middle_name: string;
  @Property(/^.+$/, true)
  last_name: string;

  @Transform(
    (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`,
    (value) => value.toLowerCase(),
  )
  @Property(/^male|female|Male|Female$/, false)
  gender: string;
  @Property(/^[0-9-]+$/, false)
  tel_number: string;

  @Property(Account, true)
  account: IAccountDocument;

  // Address
  @Transform(
    (value) => value,
    (value) => value && value.map((address) => address._id ? address : { ...address, _id: new id() }),
  )
  @Property([Address], false)
  addresses: IAddress[];
  // Payment method
  @Transform(
    (value) => value,
    (value) => value &&
      value.map((paymentMethod) => paymentMethod._id ? paymentMethod : { ...paymentMethod, _id: new id() }),
  )
  @Property([PaymentMethod], false)
  payment_methods: IPaymentMethod[];

  @Property(String, true)
  avatar: string;

  @Property(/^User|CoSeller|Admin$/, false)
  type: string;

  // @Property([Product], false)
  // products: IProductDocument[];

  // Register to be a CoSeller
  @Property(/^Idle|Pending|Approved$/, false)
  coseller_register_status: string;
  @Property(String, false)
  citizen_card_image: string;

  @Property(Date, false)
  createAt: Date;
  @Property(Date, false)
  updateAt: Date;

  static onCreating(user: IUserDocument) {
    user.addresses = [];
    user.payment_methods = [];
    user.createAt = new Date();
    user.updateAt = new Date();

    user.type = user.type || 'User';

    if (!user.account.facebook && !user.account.password) {
      return Promise.reject(new Error('expected one login method'));
    }

    user.coseller_register_status = user.coseller_register_status || 'Idle';

    // if (user.type !== 'CoSeller' && user.products) {
    //   return Promise.reject(new Error('only co-seller can have products'));
    // }
  }

  static onSaving(user: User, changes: Iridium.Changes) {
    user.updateAt = new Date();
  }

  addAddress(address: IAddress) {
    this.addresses.push(address);
    this.addresses = this.addresses;
    return this.addresses[this.addresses.length - 1]._id;
  }

  editAddress(address: IAddress) {
    if (address._id) {
      for (const old_address of this.addresses) {
        if (old_address._id.toString() === address._id) {
          old_address.address = address.address;
          old_address.city = address.city;
          old_address.country = address.country;
          old_address.zip = address.zip;
          return address._id;
        }
      }
    }
    return this.addAddress({
      address: address.address,
      city: address.city,
      country: address.country,
      zip: address.zip,
    });
  }

  addPaymentMethod(payment_method: IPaymentMethod) {
    this.payment_methods.push(payment_method);
    this.payment_methods = this.payment_methods;
    return this.payment_methods[this.payment_methods.length - 1]._id;
  }

  editPaymentMethod(payment_method: IPaymentMethod) {
    if (payment_method._id) {
      for (const old_payment of this.payment_methods) {
        if (old_payment._id.toString() === payment_method._id) {
          old_payment.credit_card_number = payment_method.credit_card_number;
          old_payment.valid_from_month = payment_method.valid_from_month;
          old_payment.valid_from_year = payment_method.valid_from_year;
          return payment_method._id;
        }
      }
    }
    return this.addPaymentMethod({
      credit_card_number: payment_method.credit_card_number,
      valid_from_month: payment_method.valid_from_month,
      valid_from_year: payment_method.valid_from_year,
    });
  }
}

export { IUserDocument, User };
