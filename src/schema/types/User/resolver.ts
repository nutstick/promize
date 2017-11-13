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
  },
};

export default resolver;
