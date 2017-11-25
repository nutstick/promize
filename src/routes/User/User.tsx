import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { Icon, Image } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { Card } from '../../components/Card';
/* Sub routes */
import { Account } from '../../routes/User/Account';
import { Activities } from '../../routes/User/Activities';
import { BecomeCoSeller } from '../../routes/User/BecomeCoSeller';
import { BuyOrderReceipts } from '../../routes/User/BuyOrderReceipts';
import { OrderReceipts } from '../../routes/User/OrderReceipts';
import { PaymentMethod } from '../../routes/User/PaymentMethod';
/* Sub routes */
import { Products } from '../../routes/User/Products';
import { ICoSeller, IUser } from '../../schema/types/User';
import * as s from './User.css';
import * as USERQUERY from './UserQuery.gql';

namespace User {
  export type IProps = RouteComponentProps<{ id: string }>;

  export interface MeQuery {
    user: IUser;
    me: {
      _id: string;
    };
  }

  type WrapWithMeQuery = ChildProps<IProps, MeQuery>;

  export type Props = WrapWithMeQuery;
}

@withStyles(s)
@graphql<User.IProps, User.MeQuery>(USERQUERY, {
  options(props) {
    return {
      variables: {
        id: props.match.params.id,
      },
    };
  },
})
export class User extends React.Component<User.Props> {
  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    document.title = 'User';
  }

  private name(user) {
    if (user.middleName) {
      return `${user.firstName} ` +
        `${user.middleName}` +
        `${user.lastName}`;
    }
    return `${user.firstName} ` +
      `${user.lastName}`;
  }

  public render() {
    const { user, loading, error } = this.props.data;
    return (
      <div className={s.root}>
        <Card className={s.sidebar}>
          <p>sidebar here</p>
        </Card>
        <Card className={s.mainContent}>
          <div className={s.container}>
            {
              loading || error ? <div className={s.profile}>
                <div className={s.avatarLoading} />
                <div className={s.nameLoading} />
              </div> :
                <div className={s.profile}>
                  <Image src={user.avatar} />
                  <div className={s.name}>
                    {this.name(user)}
                  </div>
                  <div className={s.detail}>
                    {(user as ICoSeller).telNumber}
                    {user.createAt}
                    {(user as ICoSeller).coseller && 'CoSeller'}
                  </div>
                </div>
            }
            {
              loading || error ? <div></div> :
                <div className={s.menu}>
                  {/* Menu Select*/}
                  {this.props.data.me._id === user._id ? (
                    <div>
                      <div>My Activities</div>
                      {(user as ICoSeller).coseller && <div>My Products</div>}
                      {(user as ICoSeller).coseller && <div>Product Orders</div>}
                      <div>Order reciepts</div>
                      <div>Account setting</div>
                      <div>Payment setting</div>
                      {!(user as ICoSeller).coseller && <div>
                        <Icon name="lock" />
                        Co-Seller
                      </div>}
                    </div>
                  ) : (user as ICoSeller).coseller ? (
                    <div>
                      <div>Activities</div>
                      <div>Products</div>
                    </div>
                  ) : (
                        <div>
                          <div>Activities</div>
                        </div>
                      )}
                </div>
            }
          </div>
          <div className={s.content}>
            {this.props.data.me._id === user._id ? (
              <Switch>
                {(user as ICoSeller).coseller && <Route path="/users/:id/products" component={Products} />}
                {(user as ICoSeller).coseller && <Route path="/users/:id/buyorders" component={BuyOrderReceipts} />}
                <Route path="/users/:id/receipts" component={OrderReceipts} />
                <Route path="/users/:id/account" component={Account} />
                <Route path="/users/:id/payment" component={PaymentMethod} />
                {!(user as ICoSeller).coseller && <Route path="/users/:id/coseller" component={BecomeCoSeller} />}
                <Route component={Activities} />
              </Switch>
            ) : (user as ICoSeller).coseller ? (
              <Switch>
                <Route path="/users/:id/products" component={Products} />
                <Route component={Activities} />
              </Switch>
            ) : (
                  <Switch>
                    <Route component={Activities} />
                  </Switch>
                )}
          </div>
        </Card>
      </div>
    );
  }
}
