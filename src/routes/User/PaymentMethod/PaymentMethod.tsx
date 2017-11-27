import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Loader } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { IPaymentMethod } from '../../../schema/types/User';
import * as PAYMENTMETHODSQUERY from './../../../apollo/PaymentMethodsQuery.gql';
import * as ADDPAYMENTMETHODMUTATION from './AddPaymentMethodMutation.gql';
import * as s from './PaymentMethod.css';

namespace PaymentMethod {
  export type IProps = RouteComponentProps<{ id: string }>;

  export type WithAddPaymentMethodMutation = ChildProps<IProps, {}>;

  export interface PaymentMethodsQuery {
    me: {
      paymentMethods: IPaymentMethod[],
    };
  }

  export type WithPaymentMethodsQuery = ChildProps<IProps, PaymentMethodsQuery>;

  export type Props = WithPaymentMethodsQuery;
}

@withStyles(s)
@graphql<PaymentMethod.IProps, {}>(ADDPAYMENTMETHODMUTATION)
@graphql<PaymentMethod.WithAddPaymentMethodMutation, PaymentMethod.PaymentMethodsQuery>(PAYMENTMETHODSQUERY)
export class PaymentMethod extends React.Component<PaymentMethod.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>Manange Payment Method</h1>
        {
          this.props.data.loading || this.props.data.error ? (
            <div>
              <Loader />
            </div>
          ) : (
            <div>
              {this.props.data.me.paymentMethods.map((paymentMethod) => (
                <Card>
                    <h4>Visa card</h4>
                    {paymentMethod.creditCardNumber}
                    <br/>
                </Card>
              ))}
            </div>
          )
        }
      </div>
    );
  }
}
