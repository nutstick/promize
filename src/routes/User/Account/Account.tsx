import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Loader } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { IAddress } from '../../../schema/models/User/address';
import { IAccount } from '../../../schema/types/User';
import * as s from './Account.css';
import * as ACCOUNTQUERY from './AccountQuery.gql';
import * as ADDADDRESSMUTATION from './AddAddressMutation.gql';

namespace Account {
  export type IProps = RouteComponentProps<{ id: string }>;

  export type WithAddAddressMethodMutation = ChildProps<IProps, {}>;

  export interface AccountQuery {
    me: {
      account: IAccount;
      addresses: IAddress[],
    };
  }

  export type WithAccountQuery = ChildProps<IProps, AccountQuery>;

  export type Props = WithAccountQuery;
}

@withStyles(s)
@graphql<Account.IProps, {}>(ADDADDRESSMUTATION)
@graphql<Account.WithAddAddressMethodMutation, Account.AccountQuery>(ACCOUNTQUERY)
export class Account extends React.Component<Account.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>My Account</h1>
        {
          this.props.data.loading || this.props.data.error ? (
            <div>
              <Loader />
            </div>
          ) : (
            <div>
              <h4>
              {this.props.data.me.account && this.props.data.me.account.email ?
                ('Email : ' + this.props.data.me.account.email) :
                ''}
              </h4>
              <h3>Address</h3>
              {this.props.data.me.addresses.map((address) => (
                <div className={s.modal}>
                  <div className={s.contentWrapper}>
                    <div className={s.contentHeader}>
                      <div className={s.wrapContainer}>
                        <div className={s.downContent}>
                          <h3 className={s.addressid}>{address._id}</h3>
                        </div>
                      </div>
                    </div>
                    <div className={s.contentDetail}>
                      <div className={s.leftContent}>
                        <div className={s.address}>
                          <div className={s.label}>Address </div>
                          <div className={s.value}>{address.address}</div>
                        </div>
                        <div className={s.address}>
                          <div className={s.label}>City </div>
                          <div className={s.value}>{address.city}</div>
                        </div>
                        <div className={s.address}>
                          <div className={s.label}>Country </div>
                          <div className={s.value}>{address.country}</div>
                        </div>
                        <div className={s.address}>
                          <div className={s.label}>Zipcode </div>
                          <div className={s.value}>{address.zip}</div>
                        </div>
                      </div>
                    </div>
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
