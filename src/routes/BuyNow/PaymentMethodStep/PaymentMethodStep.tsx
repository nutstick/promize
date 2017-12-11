import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import Cards from 'react-credit-cards';
import * as reactCreditCardsCss from 'react-credit-cards/lib/styles-compiled.css';
import { Button, Divider, Dropdown, Form } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import * as TOGGLELOGINMODALMUTATION from '../../../apollo/login/ToggleLoginModalMutation.gql';
import { IPaymentMethod, IUser } from '../../../schema/types/User';
import * as PAYMENTSMETHODQUERY from './../../../apollo/PaymentMethodsQuery.gql';
import * as s from './PaymentMethodStep.css';

export namespace PaymentMethodStep {
  export interface IProps {
    prev: (e) => void;
    next: (e) => void;
    onStateChange?: (field, value) => void;
  }

  export type WithToggleLoginMutation = ChildProps<IProps, {}>;

  export interface UserQuery {
    me: IUser;
  }

  export type Props = ChildProps<WithToggleLoginMutation, UserQuery>;

  export interface State {
    focus: string | false;

    creditCardNumber?: string;
    creditCardNumberError: boolean;
    validFromMonth?: string;
    validFromMonthError: boolean;
    validFromYear?: string;
    validFromYearError: boolean;
    cvc?: string;
    cvcError: boolean;

    userPaymentMethod?: string;
  }
}

export const PaymentMethodOption = ({ _id, creditCardNumber }: IPaymentMethod) => (
  <Cards
    key={`${_id}`}
    number={creditCardNumber || ''}
    name={' '}
    expiry={''}
    cvc={''} />
);

@withStyles(reactCreditCardsCss, s)
@graphql<PaymentMethodStep.IProps, {}>(TOGGLELOGINMODALMUTATION)
@graphql<PaymentMethodStep.WithToggleLoginMutation, PaymentMethodStep.UserQuery>(PAYMENTSMETHODQUERY)
export class PaymentMethodStep extends React.Component<PaymentMethodStep.Props, PaymentMethodStep.State> {
  constructor(props) {
    super(props);

    this.state = {
      focus: false,
      creditCardNumberError: false,
      validFromMonthError: false,
      validFromYearError: false,
      cvcError: false,
    };
  }

  private onInputChange(field, required, e, { value }) {
    let validator = true;
    if (field === 'creditCardNumber') {
      validator = /^([0-9]{16,19})$/.test(value);
    } else if (field === 'validFromMonth') {
      validator = /^([0-9]{2,2})$/.test(value);
    } else if (field === 'validFromYear') {
      validator = /^([0-9]{2,4})$/.test(value);
    } else if (field === 'cvc') {
      validator = /^([a-z0-9]{2,4})$/.test(value);
    }

    if (value && validator) {
      this.setState({
        ...this.state,
        [field]: value,
        ...required && {
          [`${field}Error`]: false,
        },
      });
    } else {
      this.setState({
        ...this.state,
        [field]: value,
        ...required && {
          [`${field}Error`]: true,
        },
      });
    }

    if (this.props.onStateChange) {
      this.props.onStateChange(field, value);
    }
  }

  private onFocus(field) {
    this.setState({
      ...this.state,
      focus: field,
    });
  }

  private next(e) {
    const error: {
      creditCardNumberError?: boolean;
      validFromMonthError?: boolean;
      validFromYearError?: boolean;
      cvcError?: boolean;
    } = {};
    if (!this.state.creditCardNumber || !/^([0-9]{16,19})$/.test(this.state.creditCardNumber)) {
      error.creditCardNumberError = true;
    }
    if (!this.state.validFromMonth || !/^([0-9]{2,2})$/.test(this.state.validFromMonth)) {
      error.validFromMonthError = true;
    }
    if (!this.state.validFromYear || !/^([0-9]{2,4})$/.test(this.state.validFromYear)) {
      error.validFromYearError = true;
    }
    if (!this.state.cvc || !/^([a-z0-9]{2,4})$/.test(this.state.cvc)) {
      error.cvcError = true;
    }

    // If User address is set or all fields is filled call next
    // , else set state of error
    this.state.userPaymentMethod || Object.keys(error).length === 0 ?
      this.props.next(e) : this.setState({
        ...this.state,
        ...error,
      });
  }

  public render() {
    const { me, loading, error } = this.props.data;

    if (loading) {
      return 'loading';
    } else if (error) {
      return 'error';
    }

    let userPaymentMethod;
    if (me && me.paymentMethods) {
      const options = me.paymentMethods.map((paymentMethod) => ({
        key: paymentMethod._id,
        text: paymentMethod.creditCardNumber,
        value: paymentMethod._id,
        content: <PaymentMethodOption {...paymentMethod} />,
      }));

      userPaymentMethod = (
        <Dropdown
          selection
          fluid
          options={options}
          onChange={this.onInputChange.bind(this, 'userPaymentMethod', false)}
          placeholder="Choose an payment method"
        />
      );
    } else {
      userPaymentMethod = (
        <div className={s.returnCustomer}>
          Returning customer?
          <a href="#" onClick={(e) => { this.props.mutate({}); }} style={{ paddingLeft: 5 }}>
            Login
          </a>
        </div>
      );
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h4 className={s.header}>Your Payment Method</h4>
          {userPaymentMethod}
        </div>
        <Divider horizontal>Or</Divider>
        <div className={s.container}>
          <h4>New Payment Method</h4>
          <Form>
            <Cards
              number={this.state.creditCardNumber || ''}
              name={' '}
              expiry={`${this.state.validFromMonth || (this.state.validFromYear && '  ') || ''}` +
              `${this.state.validFromYear || ''}`}
              cvc={this.state.cvc}
              focused={this.state.focus} />
            <div style={{ height: 10 }}/>
            <Form.Input
              label="Credit Card Number"
              placeholder="Credit Card Number"
              error={this.state.creditCardNumberError}
              maxLength={19}
              onChange={this.onInputChange.bind(this, 'creditCardNumber', true)}
              onFocus={this.onFocus.bind(this, 'number')} />

            <Form.Group widths="equal">
              <Form.Input
                label="Month"
                placeholder="MM"
                error={this.state.validFromMonthError}
                maxLength={2}
                onChange={this.onInputChange.bind(this, 'validFromMonth', true)}
                onFocus={this.onFocus.bind(this, 'expiry')} />
              <Form.Input
                label="Year"
                placeholder="YY"
                error={this.state.validFromYearError}
                maxLength={4}
                onChange={this.onInputChange.bind(this, 'validFromYear', true)}
                onFocus={this.onFocus.bind(this, 'expiry')} />
              <Form.Input
                label="CVC"
                placeholder="CVC"
                error={this.state.cvcError}
                maxLength={4}
                onChange={this.onInputChange.bind(this, 'cvc', true)}
                onFocus={this.onFocus.bind(this, 'cvc')} />
            </Form.Group>
          </Form>
          <div className={s.buttons}>
            <Button
              className={s.left}
              content="Previous"
              onClick={this.props.prev} />
            <Button
              className={s.right}
              color="orange"
              content="Next"
              onClick={this.next.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}
