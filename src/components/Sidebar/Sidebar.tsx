import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { MutationFunc, QueryProps } from 'react-apollo';
import * as FaSignOutIcon from 'react-icons/lib/fa/sign-out';
import * as MdAssignmentIndIcon from 'react-icons/lib/md/assignment-ind';
import * as MdBorderColorIcon from 'react-icons/lib/md/border-color';
import * as MdHomeIcon from 'react-icons/lib/md/home';
import * as MdLocalOfferIcon from 'react-icons/lib/md/local-offer';
import * as MdLockOpenIcon from 'react-icons/lib/md/lock-open';
import * as MdLockOutlineIcon from 'react-icons/lib/md/lock-outline';
import * as MdLoyaltyIcon from 'react-icons/lib/md/loyalty';
import * as MdPaymentIcon from 'react-icons/lib/md/payment';
import * as MdPersonOutlineIcon from 'react-icons/lib/md/person-outline';
import * as MdRedeemIcon from 'react-icons/lib/md/redeem';
import * as MdSearchIcon from 'react-icons/lib/md/search';
import { Link } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import * as TOGGLELOGINMODALMUTATION from '../../apollo/login/ToggleLoginModalMutation.gql';
import * as SIDEBARQUERY from '../../apollo/sidebar/SidebarQuery.gql';
import * as TOGGLESIDEBARMUTATION from '../../apollo/sidebar/ToggleSidebarMutation.gql';
import { IUser } from '../../schema/types/User';
import * as MEQUERY from '../Header/MeQuery.gql';
import { Navigator } from '../Navigator';

import * as s from './Sidebar.css';
namespace Sidebar {
  export interface Menu {
    to: string;
    text: React.ReactNode;
    NavIcon?: React.ComponentClass<{
      size?: number,
      color?: string,
      style?: any,
    }>;
  }

  type SidebarQuery<P> = P & {
    sidebar?: QueryProps & Partial<{
      sidebar: {
        show: boolean,
      },
    }>;
  };
  export type WithSidebar = SidebarQuery<{}>;

  type MeQuery<P> = P & {
    me?: QueryProps & Partial<{
      me: IUser,
    }>;
  };
  export type WithMe = MeQuery<WithSidebar>;

  type ToggleSidebarMutataion<P> = P & {
    toggleSidebar?: MutationFunc<{}>;
  };
  export type WithToggleSidebarMutataion = ToggleSidebarMutataion<WithMe>;

  type ToggleLoginModalMutataion<P> = P & {
    toggleLoginModal?: MutationFunc<{}>;
  };
  export type WithToggleLoginModalMutation = ToggleLoginModalMutataion<WithToggleSidebarMutataion>;

  export type Props = WithToggleLoginModalMutation;
}

@withStyles(s)
@graphql(SIDEBARQUERY, { name: 'sidebar' })
@graphql(MEQUERY, { name: 'me' })
@graphql(TOGGLESIDEBARMUTATION, { name: 'toggleSidebar' })
@graphql(TOGGLELOGINMODALMUTATION, { name: 'toggleLoginModal' })
export class Sidebar extends React.Component<Sidebar.Props> {
  private menu(): Sidebar.Menu[] {
    const me = this.props.me.me;
    const role = this.props.me.me.__typename;
    return [
      {
        to: '/',
        text: 'Home',
        NavIcon: MdHomeIcon,
      },
      {
        to: '/search',
        text: 'Search',
        NavIcon: MdSearchIcon,
      },
      ...(role === 'Admin' ? [{
        to: `/users/${me._id}/admin`,
        text: 'Admin',
        NavIcon: MdAssignmentIndIcon,
      }] : []),
      ...(role === 'CoSeller' ? [{
        to: `/users/${me._id}/products`,
        text: 'My Products',
        NavIcon: MdRedeemIcon,
      }, {
        to: `/users/${me._id}/buyorders`,
        text: 'Product Orders',
        NavIcon: MdLoyaltyIcon,
      }] : []),
      {
        to: `/users/${me._id}/receipts`,
        text: 'Order receipts',
        NavIcon: MdLocalOfferIcon,
      },
      {
        to: `/users/${me._id}/account`,
        text: 'Account setting',
        NavIcon: MdPersonOutlineIcon,
      },
      {
        to: `/users/${me._id}/payment`,
        text: 'Payment setting',
        NavIcon: MdPaymentIcon,
      },
      ...(role === 'User' ? [{
        to: `/users/${me._id}/coseller`,
        text: 'Become CoSeller',
        NavIcon: MdLockOutlineIcon,
      }] : []),
    ];
  }

  public render() {
    const { me } = this.props.me;
    return (
      <div className={cx(s.root, { [s.show]: this.props.sidebar.sidebar && this.props.sidebar.sidebar.show })}>
        <div className={s.sidebar}>
          {
            me && <Link
              className={s.header}
              to={`/users/${me._id}`}
              style={{ display: 'block' }}
              onClick={() => { this.props.toggleSidebar({}); }}>
              <Image avatar src={me.avatar} /> {this.props.me.me.firstName}
            </Link>
          }
          <div className={s.menuList}>
            {/* Menu Select*/}
            <Navigator>
              {this.props.me.me && this.props.me.me._id ? [
                ...this.menu().map(({ to, text, NavIcon }) => (
                  <Navigator.Item as={Link} to={to} onClick={() => { this.props.toggleSidebar({}); }}>
                    <NavIcon size={24} color="#ff8500" style={{ marginRight: 8 }} />
                    {text}
                  </Navigator.Item>
                )),
                <Navigator.Item href="/logout">
                  <FaSignOutIcon size={24} color="#ff8500" style={{ marginRight: 8 }} />
                  Log Out
                </Navigator.Item>,
              ] : [
                <Navigator.Item href="#" onClick={(e) => {
                  this.props.toggleLoginModal({});
                  this.props.toggleSidebar({});
                }}>
                  <MdLockOpenIcon size={24} color="#ff8500" style={{ marginRight: 8 }} />
                  Log In
                </Navigator.Item>,
                <Navigator.Item href="#" onClick={(e) => {
                  this.props.toggleLoginModal({});
                  this.props.toggleSidebar({});
                }}>
                  <MdBorderColorIcon size={24} color="#ff8500" style={{ marginRight: 8 }} />
                  Sign up
                </Navigator.Item>,
              ]}
            </Navigator>
          </div>
        </div>
        <div className={s.background} onClick={() => { this.props.toggleSidebar({}); }}>
        </div>
      </div>
    );
  }
}
