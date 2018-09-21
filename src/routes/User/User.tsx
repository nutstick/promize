import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import * as MdAssignmentIndIcon from 'react-icons/lib/md/assignment-ind';
import * as MdExploreIcon from 'react-icons/lib/md/explore';
import * as MdLocalOfferIcon from 'react-icons/lib/md/local-offer';
import * as MdLockOutlineIcon from 'react-icons/lib/md/lock-outline';
import * as MdLoyaltyIcon from 'react-icons/lib/md/loyalty';
import * as MdPaymentIcon from 'react-icons/lib/md/payment';
import * as MdPersonOutlineIcon from 'react-icons/lib/md/person-outline';
import * as MdRedeemIcon from 'react-icons/lib/md/redeem';
import { Redirect } from 'react-router';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import * as sizeMe from 'react-sizeme';
import { Icon, Image, Label } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { Card } from '../../components/Card';
import { Navigator } from '../../components/Navigator';
/* Sub routes */
import { Account } from '../../routes/User/Account';
import { Activities } from '../../routes/User/Activities';
import { Admin } from '../../routes/User/Admin';
import { BecomeCoSeller } from '../../routes/User/BecomeCoSeller';
import { BuyOrderReceipts } from '../../routes/User/BuyOrderReceipts';
import { CreateProduct } from '../../routes/User/CreateProduct';
import { OrderReceipts } from '../../routes/User/OrderReceipts';
import { PaymentMethod } from '../../routes/User/PaymentMethod';
/* Sub routes */
import { Products } from '../../routes/User/Products';
import { IUserType } from '../../schema/types/User';
import * as s from './User.css';
import * as USERQUERY from './UserQuery.gql';

namespace User {
  export interface Menu {
    to: string;
    text: React.ReactNode;
    NavIcon?: React.ComponentClass<{
      size?: number,
      color?: string,
      style?: any,
    }>;
  }

  export type IProps = RouteComponentProps<{ id: string }>;

  export type WithSizeMe = {
    self?: boolean,
    size?: {
      width?: number,
      height?: number,
      position?: number,
    };
  } & IProps;

  export interface MeQuery {
    user: IUserType;
    me: {
      _id: string;
    };
  }

  type WithMeQuery = ChildProps<WithSizeMe, MeQuery>;

  export type Props = WithMeQuery;
}

@withStyles(s)
@sizeMe()
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
    const date = new Date(createAt);
    const currentDate = new Date();
    const diff = Math.ceil(Math.abs(currentDate.getTime() - date.getTime()) / (1000 * 3600 * 24));

    if (diff < 365) {
      return 'New commer';
    }
    return `${Math.floor(diff / 365)} Year${diff > 730 && s}`;
  }

  private menu(role: string, me: boolean): User.Menu[] {
    return me ? [
      {
        to: `/users/${this.props.match.params.id}`,
        text: 'My Activities',
        NavIcon: MdExploreIcon,
      },
      ...(role === 'Admin' ? [{
        to: `/users/${this.props.match.params.id}/admin`,
        text: 'Admin',
        NavIcon: MdAssignmentIndIcon,
      }] : []),
      ...(role === 'CoSeller' ? [{
        to: `/users/${this.props.match.params.id}/products`,
        text: 'My Products',
        NavIcon: MdRedeemIcon,
      }, {
        to: `/users/${this.props.match.params.id}/buyorders`,
        text: 'Product Orders',
        NavIcon: MdLoyaltyIcon,
      }] : []),
      {
        to: `/users/${this.props.match.params.id}/receipts`,
        text: 'Order receipts',
        NavIcon: MdLocalOfferIcon,
      },
      {
        to: `/users/${this.props.match.params.id}/account`,
        text: 'Account setting',
        NavIcon: MdPersonOutlineIcon,
      },
      {
        to: `/users/${this.props.match.params.id}/payment`,
        text: 'Payment setting',
        NavIcon: MdPaymentIcon,
      },
      ...(role === 'User' ? [{
        to: `/users/${this.props.match.params.id}/coseller`,
        text: 'CoSeller',
        NavIcon: MdLockOutlineIcon,
      }] : []),
    ] : [
      {
        to: `/users/${this.props.match.params.id}`,
        text: 'Activities',
        NavIcon: MdExploreIcon,
      },
      ...(role === 'CoSeller' ? [{
        to: `/users/${this.props.match.params.id}/products`,
        text: 'Products',
        NavIcon: MdRedeemIcon,
      }] : []),
    ];
  }

  public render() {
    const mobile = this.props.size.width <= 620;
    const { me, user, loading, error } = this.props.data;

    return !loading && !error && !user ? (
      <div className={s.root}>
        <Card className={s.mainContent}>
          <div className={s.notfound}>
            User not found.
          </div>
        </Card>
      </div>
    ) : (
      <div className={s.root}>
        <div className={s.sidebar}>
          {
            loading || error ? <div className={s.profile}>
              <div className={s.avatarLoading} />
              <div className={s.nameLoading} />
            </div> :
              <div className={s.profile}>
                <Image centered rounded size="small" src={user.avatar} className={s.profileImage} />
                <h1 className={s.name}>
                  {this.name(user)}
                </h1>
                <div className={s.detail}>
                  {user.__typename === 'CoSeller' &&
                    <Label color="orange">
                      CoSeller
                    </Label>
                  }
                  {user.telNumber &&
                    <Label color="yellow">
                      <Icon name="check" />
                      Verify
                    </Label>
                  }
                  <Label color="brown">
                    {this.registerTime(user.createAt)}
                  </Label>
                </div>
              </div>
          }
          {
            loading || error ? <div className={s.menu}></div> :
            (<div className={s.menuWrapper}>
              {/* Menu Select*/}
              <Navigator scrollable={mobile} horizontal={mobile}>
                {this.menu(user.__typename, me && user._id === me._id).map(({ to, text, NavIcon }) => (
                  <Navigator.Item as={NavLink} to={to} exact>
                    {!mobile && <NavIcon size={24} color="#ff8500" style={{ marginRight: 8 }} />}
                    {text}
                  </Navigator.Item>
                ))}
              </Navigator>
            </div>)
          }
        </div>
        <Card className={s.mainContent}>
          <div className={s.content}>
            {!loading && !error && this.props.data.me && this.props.data.me._id === user._id ? (
              <Switch>
                <Route exact path="/users/:id" component={Activities} />
                {user.__typename === 'CoSeller' && <Route
                  exact
                  path="/users/:id/products"
                  render={(props) => (<Products self {...props} />)} />}
                <Route path="/users/:id/products/create" component={CreateProduct} />
                {user.__typename === 'CoSeller' && <Route path="/users/:id/buyorders" component={BuyOrderReceipts} />}

                {user.__typename === 'Admin' && <Route path="/users/:id/admin" component={Admin} />}
                <Route path="/users/:id/receipts" component={OrderReceipts} />
                <Route path="/users/:id/account" component={Account} />
                <Route path="/users/:id/payment" component={PaymentMethod} />
                {user.__typename !== 'CoSeller' && <Route path="/users/:id/coseller" component={BecomeCoSeller} />}
                <Route render={() => (
                  <Redirect to={`/users/${this.props.match.params.id}`} />
                )} />
              </Switch>
            ) : !loading && !error && user.__typename === 'CoSeller' ? (
              <Switch>
                <Route exact path="/users/:id" component={Activities} />
                <Route path="/users/:id/products" component={Products} />
                <Route render={() => (
                  <Redirect to={`/users/${this.props.match.params.id}`} />
                )} />
              </Switch>
            ) : (
              <Switch>
                <Route exact path="/users/:id" component={Activities} />
                {!loading && !error && <Route render={() => (
                  <Redirect to={`/users/${this.props.match.params.id}`} />
                )} />}
              </Switch>
            )}
          </div>

        </Card>
      </div>
    );
  }
}
