import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import * as MdLocationOnIcon from 'react-icons/lib/md/location-on';
import * as MdPersonOutlineIcon from 'react-icons/lib/md/person-outline';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, Icon, Loader } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { contentClass, headingClass } from '../../../components/Card';
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

  private addAddress() {
    return false;
  }

  public render() {
    return (
      <div className={s.root}>
        <div className={headingClass}>
          <MdPersonOutlineIcon size={25} style={{
            marginRight: 2.5,
          }} color="#ff9521" />
          <span>Account settings</span>
        </div>
        {this.props.data.loading || this.props.data.error ? (
          <div className={contentClass}>
            <Loader active />
          </div>
        ) : (
          <div className={contentClass} style={{ flexDirection: 'column' }}>
            <div>
              {this.props.data.me.account && this.props.data.me.account.email ?
                ('Email : ' + this.props.data.me.account.email) :
                ''}
            </div>
            <div>
              Facebook: {this.props.data.me.account.facebookAccessCode ? (
                <Button color="facebook" size="tiny">
                  <Icon name="facebook" /> Linked
                </Button>
              ) : (
                <Button color="facebook" size="tiny">
                  <Icon name="facebook" /> Link
                </Button>
              )}
            </div>
            <div>
              Google: {this.props.data.me.account.googleAccessCode ? (
                <Button color="google plus" size="tiny">
                  <Icon name="google plus" /> Linked
                </Button>
              ) : (
                <Button color="google plus" size="tiny">
                  <Icon name="google plus" /> Link
                </Button>
              )}
            </div>
          </div>
        )}
        <div className={headingClass}>
          <MdLocationOnIcon size={25} style={{
            marginRight: 2.5,
          }} color="#ff9521" />
          <span>Addresses</span>
        </div>
        {this.props.data.loading || this.props.data.error ? (
          <div className={contentClass}>
            <Loader />
          </div>
        ) : this.props.data.me.addresses.length === 0 ? (
          <div className={cx(contentClass, s.empty)}>
            No address found.
            <a onClick={this.addAddress.bind(this)}>Add address</a>
          </div>
        ) : this.props.data.me.addresses.map((address) => (
          <Card>
            <Card.Content>
              <p>Address: {address.address}</p>
              <p>City: {address.city}</p>
              <p>Country: {address.country}</p>
              <p>Zip: {address.zip}</p>
            </Card.Content>
          </Card>
        ))}
      </div>
    );
  }
}
