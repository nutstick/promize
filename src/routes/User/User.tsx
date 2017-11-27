import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Divider, Grid, Icon, Image, List } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { Card } from '../../components/Card';
/* Sub routes */
import { Account } from '../../routes/User/Account';
import { Activities } from '../../routes/User/Activities';
import { BecomeCoSeller } from '../../routes/User/BecomeCoSeller';
import { BuyOrderReceipts } from '../../routes/User/BuyOrderReceipts';
import { CreateProduct } from '../../routes/User/CreateProduct';
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

  private registerTime(createAt) {
    const d = new Date(createAt);
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
  }

  public render() {
    const { user, loading, error } = this.props.data;
    return (
      <div className={s.root}>
        <Card className={s.mainContent}>
          <Grid>
            <Grid.Column mobile={16} tablet={6} computer={4}>
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
                        {user.account && user.account.email ? ('Email: ' + user.account.email) : ''}
                        {(user as ICoSeller).coseller && 'CoSeller'}
                        <br />
                        {(user as ICoSeller).telNumber}
                        <br />
                        Registration date: {this.registerTime(user.createAt)}
                        <Divider section />
                      </div>
                    </div>
                }
                {
                  loading || error ? <div className={s.menu}></div> :
                    <div className={s.menu}>
                      <List selection verticalAlign="middle">
                        {/* Menu Select*/}
                        {this.props.data.me._id === user._id ? (
                          <div>
                            <ul>
                              <li>
                                <NavLink
                                  to={`/users/${this.props.match.params.id}`}
                                  exact
                                  activeClassName={s.active}>
                                  <Icon name="feed" />
                                  My Activities
                                </NavLink>
                              </li>
                              {(user as ICoSeller).coseller &&
                                <li>
                                  <NavLink
                                    to={`/users/${this.props.match.params.id}/products`}
                                    activeClassName={s.active}>
                                    <Icon name="shopping basket" />
                                    My Products
                                  </NavLink>
                                </li>
                              }

                              {(user as ICoSeller).coseller &&
                                <li>
                                  <NavLink
                                    to={`/users/${this.props.match.params.id}/buyorders`}
                                    activeClassName={s.active}>
                                    <Icon name="ordered list" />
                                    Product Orders
                                  </NavLink>
                                </li>
                              }
                              <li>
                                <NavLink
                                  to={`/users/${this.props.match.params.id}/receipts`}
                                  activeClassName={s.active}>
                                  <Icon name="barcode" />
                                  Order receipts
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to={`/users/${this.props.match.params.id}/account`}
                                  activeClassName={s.active}>
                                  <Icon name="settings" />
                                  Account setting
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to={`/users/${this.props.match.params.id}/payment`}
                                  activeClassName={s.active}>
                                  <Icon name="payment" />
                                  Payment setting
                                </NavLink>
                              </li>
                              {!(user as ICoSeller).coseller &&
                                <li>
                                  <NavLink
                                    to={`/users/${this.props.match.params.id}/coseller`}
                                    activeClassName={s.active}>
                                    <Icon name="lock" />
                                    Co-Seller
                                  </NavLink>
                                </li>
                              }
                            </ul>
                          </div>
                        ) : (user as ICoSeller).coseller ? (
                          <div>
                            <List.Item>
                              <List.Content>
                                <NavLink
                                  to={`/users/${this.props.match.params.id}`}
                                  activeClassName={s.active}>
                                  <Icon name="feed" />
                                  Activities
                            </NavLink>
                              </List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Content>
                                <NavLink
                                  to={`/users/${this.props.match.params.id}/products`}
                                  activeClassName={s.active}>
                                  <Icon name="shopping bag" />
                                  Products
                            </NavLink>
                              </List.Content>
                            </List.Item>
                          </div>
                        ) : (
                              <div>
                                <NavLink to={`/users/${this.props.match.params.id}`}>Activities</NavLink>
                              </div>
                            )}
                      </List>
                    </div>
                }
              </div>
            </Grid.Column>

            <Grid.Column mobile={16} tablet={10} computer={12} className={s.content}>
              <div >
                {!loading && !error && this.props.data.me && this.props.data.me._id === user._id ? (
                  <Switch>
                    <Route exact path="/users/:id" component={Activities} />
                    {(user as ICoSeller).coseller && <Route
                      exact
                      path="/users/:id/products"
                      render={(props) => (<Products self {...props} />)} />}
                    <Route path="/users/:id/products/create" component={CreateProduct} />
                    {(user as ICoSeller).coseller && <Route path="/users/:id/buyorders" component={BuyOrderReceipts} />}
                    <Route path="/users/:id/receipts" component={OrderReceipts} />
                    <Route path="/users/:id/account" component={Account} />
                    <Route path="/users/:id/payment" component={PaymentMethod} />
                    {!(user as ICoSeller).coseller && <Route path="/users/:id/coseller" component={BecomeCoSeller} />}
                    <Route render={() => (
                      <Redirect to={`/user/${this.props.match.params.id}`} />
                    )} />
                  </Switch>
                ) : !loading && !error && (user as ICoSeller).coseller ? (
                  <Switch>
                    <Route exact path="/users/:id" component={Activities} />
                    <Route path="/users/:id/products" component={Products} />
                    <Route render={() => (
                      <Redirect to={`/user/${this.props.match.params.id}`} />
                    )} />
                  </Switch>
                ) : (
                      <Switch>
                        <Route exact path="/users/:id" component={Activities} />
                        <Route render={() => (
                          <Redirect to={`/user/${this.props.match.params.id}`} />
                        )} />
                      </Switch>
                    )}
              </div>
            </Grid.Column>
          </Grid>
        </Card>
      </div>
    );
  }
}
