import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
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

        <Card.Group>
          {this.props.data.me.addresses.map((address) => (
            <Card>
              <Card.Content>
                <p>Address: {address.address}</p>
                <p>City: {address.city}</p>
                <p>Country: {address.country}</p>
                <p>Zip: {address.zip}</p>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
    );
  }
}
