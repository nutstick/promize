import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { Divider, Icon, Image, List } from 'semantic-ui-react';
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

  type WithMeQuery = ChildProps<IProps, MeQuery>;

  export type Props = WithMeQuery;
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
        <div className={s.sidebar}>
          {
            loading || error ? <div className={s.profile}>
              <div className={s.avatarLoading} />
              <div className={s.nameLoading} />
            </div> :
              <div className={s.profile}>
                <Image centered rounded size="small" src={user.avatar} className={s.profileImage} />
                <div className={s.name}>
                  {this.name(user)}
                </div>
                <div className={s.detail}>
                  {(user as ICoSeller).coseller && 'CoSeller'}
                  <br />
                  {(user as ICoSeller).telNumber}
                  <br />
                  {user.createAt}
                  <Divider section />
                </div>
              </div>
          }
          {
            loading || error ? <div className={s.menu}></div> :
              <div className={s.menu}>
                {/* Menu Select*/}
                {this.props.data.me._id === user._id ? (
                  <div className={s.menu}>
                    <NavLink
                      to={`/users/${this.props.match.params.id}`}
                      exact
                      activeClassName={s.active}>
                      My Activities
                      </NavLink>
                    {(user as ICoSeller).coseller &&
                      <NavLink
                        to={`/users/${this.props.match.params.id}/products`}
                        activeClassName={s.active}>
                        My Products
                        </NavLink>
                    }
                    {(user as ICoSeller).coseller &&
                      <NavLink
                        to={`/users/${this.props.match.params.id}/buyorders`}
                        activeClassName={s.active}>
                        Product Orders
                        </NavLink>
                    }
                    <NavLink
                      to={`/users/${this.props.match.params.id}/receipts`}
                      activeClassName={s.active}>
                      Order reciepts
                      </NavLink>
                    <NavLink
                      to={`/users/${this.props.match.params.id}/account`}
                      activeClassName={s.active}>
                      Account setting
                      </NavLink>
                    <NavLink
                      to={`/users/${this.props.match.params.id}/payment`}
                      activeClassName={s.active}>
                      Payment setting
                      </NavLink>
                    {!(user as ICoSeller).coseller && <NavLink
                      to={`/users/${this.props.match.params.id}/coseller`}
                      activeClassName={s.active}>
                      <Icon name="lock" />
                      Co-Seller
                      </NavLink>}
                  </div>
                ) : (user as ICoSeller).coseller ? (
                  <div className={s.menu}>
                    <List.Content>
                      <NavLink
                        to={`/users/${this.props.match.params.id}`}
                        activeClassName={s.active}>
                        Activities
                      </NavLink>
                    </List.Content>
                    <List.Content>
                      <NavLink
                        to={`/users/${this.props.match.params.id}/products`}
                        activeClassName={s.active}>
                        Products
                      </NavLink>
                    </List.Content>
                  </div>
                ) : (
                      <div>
                        <NavLink to={`/users/${this.props.match.params.id}`}>Activities</NavLink>
                      </div>
                    )}
              </div>
          }
        </div>
        <Card className={s.mainContent}>
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
