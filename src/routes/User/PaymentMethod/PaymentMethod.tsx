import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import Cards from 'react-credit-cards';
import * as reactCreditCardsCss from 'react-credit-cards/lib/styles-compiled.css';
import * as MdPaymentIcon from 'react-icons/lib/md/payment';
import { RouteComponentProps } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { contentClass, headingClass } from '../../../components/Card';
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

@withStyles(reactCreditCardsCss, s)
@graphql<PaymentMethod.IProps, {}>(ADDPAYMENTMETHODMUTATION)
@graphql<PaymentMethod.WithAddPaymentMethodMutation, PaymentMethod.PaymentMethodsQuery>(PAYMENTMETHODSQUERY)
export class PaymentMethod extends React.Component<PaymentMethod.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root}>
        <div className={headingClass}>
          <MdPaymentIcon size={25} style={{
            marginRight: 2.5,
          }} color="#ff9521" />
          <span>Manange Payment Method</span>
        </div>
        {
          this.props.data.loading || this.props.data.error ? (
            <div className={contentClass}>
              <Loader active />
            </div>
          ) : this.props.data.me.paymentMethods.length === 0 ? (
            <div className={cx(contentClass, s.empty)}>
              No PaymentMethod found.
            </div>
          ) : (
            <div className={contentClass}>
              {this.props.data.me.paymentMethods.map((node) => (
                <div key={node._id} className={s.modal}>
                  <div className={s.pictureWrapper}>
                    <Cards
                      number={node.creditCardNumber.replace(/#/g, '')}
                      name={' '}
                      expiry={' '}
                      cvc={' '}
                    />
                  </div>
                  <div className={s.contentWrapper}>
                    <h3 className={s.productName}>Card number : {node.creditCardNumber}</h3>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    );
  }
}
