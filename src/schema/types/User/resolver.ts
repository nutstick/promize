import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  Account: {
    facebookAccessCode({ facebook }) {
      return facebook.accessCode;
    },
    googleAccessCode({ google }) {
      return google.accessCode;
    },
  },
  PaymentMethod: {
    creditCardNumber({ credit_card_number }) {
      // For security credit card number will only show last 4 digits.
      return '#'.repeat(credit_card_number.length - 4) + credit_card_number.slice(-4);
    },
  },
  UserType: {
    __resolveType({ type }) {
      return type;
    },
  },
  User: {
    firstName({ first_name }) {
      return first_name;
    },
    middleName({ middle_name }) {
      return middle_name;
    },
    lastName({ last_name }) {
      return last_name;
    },
    telNumber({ tel_number }) {
      return tel_number;
    },
    paymentMethod({ payment_methods }, { id }) {
      return payment_methods.find((payment_method) => payment_method._id === id);
    },
    paymentMethods({ payment_methods }) {
      return payment_methods;
    },
    address({ addresses }, { id }) {
      return addresses.find((address) => address._id === id);
    },
    // TODO: orderReceipts
  },
  CoSeller: {
    firstName({ first_name }) {
      return first_name;
    },
    middleName({ middle_name }) {
      return middle_name;
    },
    lastName({ last_name }) {
      return last_name;
    },
    telNumber({ tel_number }) {
      return tel_number;
    },
    paymentMethod({ payment_methods }, { id }) {
      return payment_methods.find((payment_method) => payment_method._id === id);
    },
    paymentMethods({ payment_methods }) {
      return payment_methods;
    },
    address({ addresses }, { id }) {
      return addresses.find((address) => address._id === id);
    },
    // TODO: orderReceipts
    coseller() {
      return true;
    },
    // TODO: products, buyOrderReceipts
  },
};

export default resolver;
