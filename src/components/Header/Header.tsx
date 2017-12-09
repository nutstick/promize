import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { defineMessages, FormattedMessage, IntlProvider } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { sizeMe } from 'react-sizeme';
import { Container, Dropdown, Icon, Image, Label, Menu } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import * as TOGGLELOGINMODALMUTATION from '../../apollo/login/ToggleLoginModalMutation.gql';
import { parseSearch } from '../../core/urlParser';
import { ICoSeller, IUser } from '../../schema/types/User';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { SearchInput } from '../SearchInput/SearchInput';
import * as s from './Header.css';
import * as MEQUERY from './MeQuery.gql';
import * as logoUrl from './promizeLogoWhite.svg';

namespace Header {
  export type WithRouter = RouteComponentProps<{}>;
  export type WithSizeMe = {
    self?: boolean,
    size?: {
      width?: number,
      height?: number,
      position?: number,
    };
  } & WithRouter;
  export type WithToggleLoginMutation = ChildProps<WithSizeMe, {}>;
  export type Props = ChildProps<WithToggleLoginMutation, { me: IUser | ICoSeller }>;

  export interface State {
    search?: string | string[];
  }
}

const messages = defineMessages({
  welcome: {
    id: 'header.welcome',
    defaultMessage: 'Welcome to Promize!',
    description: 'Welcome message in header',
  },
  join: {
    id: 'header.join',
    defaultMessage: 'Join Free',
    description: 'Join Free message in header',
  },
  logIn: {
    id: 'header.logIn',
    defaultMessage: 'Log in',
    description: 'Log in message in header',
  },
  search: {
    id: 'header.search',
    defaultMessage: 'Search...',
    description: 'Search place holder on header',
  },
});

@withStyles(s)
@sizeMe()
@graphql(TOGGLELOGINMODALMUTATION)
@graphql(MEQUERY)
export class Header extends React.Component<Header.Props, Header.State> {
  static contextTypes = {
    intl: IntlProvider.childContextTypes.intl,
  };

  constructor(props) {
    super(props);
  }

  private onSearchSubmit(e, keywords): void {
    const params = keywords.map((keyword) => JSON.stringify(keyword)).join(',');
    this.props.history.push(`/search?keywords=${params}`);
  }

  // private onRouteChanged() {
  //   const search = parseSearch(this.props.location);
  //   if (search) {
  //     this.setState({
  //       search,
  //     });
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   if (this.props.location !== prevProps.location) {
  //     this.onRouteChanged();
  //   }
  // }

  public render() {
    const trigger = this.props.data.me && (
      <span>
        <Image avatar src={this.props.data.me.avatar} /> {this.props.data.me.firstName}
      </span>
    );

    return this.props.size.width <= 620 ? (
      <div className={cx(s.root, s.mobile, s.bg)}>
        <div className={cx(s.menu, s.transparent)}>
          <Icon className={s.burger} name="bars"/>
          <Link className={s.logoWrapper} to="/">
            <img
              className={s.logo}
              src={logoUrl}
              alt="Promize" />
          </Link>
        </div>
      </div>
    ) : (
      <div className={cx(s.root, s.bg)}>
        <Menu className={cx(s.menu, s.black)} size="small" borderless>
          <Container>
            <Menu.Item className={s.welcome}as="welcome">
              <FormattedMessage {...messages.welcome} />
              {
                this.props.data.loading ? <div /> :
                this.props.data.error ? <div /> :
                this.props.data.me ? <span className={s.highlightedText}>{this.props.data.me.firstName}</span> :
                <div className={s.hideOnMobile}>
                  <span className={s.highlightedText}>
                    <FormattedMessage {...messages.join} />
                  </span>
                  or
                  <span className={s.highlightedText}>
                    <FormattedMessage {...messages.logIn} />
                  </span>
                </div>
              }
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <LanguageSwitcher />
              </Menu.Item>
              {
                this.props.data.loading ? <div /> :
                this.props.data.error ? <div /> :
                this.props.data.me ?
                <Dropdown trigger={trigger} pointing className="link item">
                  <Dropdown.Menu>
                    <Dropdown.Header as={Link} to={`/users/${this.props.data.me._id}`} style={{ display: 'block' }}>
                      <Image avatar src={this.props.data.me.avatar} /> Hi! {this.props.data.me.firstName}
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    {this.props.data.me.__typename === 'CoSeller' &&
                      <Dropdown.Item
                        as={Link}
                        to={`/users/${this.props.data.me._id}/products/create`}>
                        Create new product
                      </Dropdown.Item>
                    }
                    {this.props.data.me.__typename === 'CoSeller' &&
                      <Dropdown.Item
                        as={Link}
                        to={`/users/${this.props.data.me._id}/products`}>
                        My Products
                      </Dropdown.Item>
                    }
                    {this.props.data.me.__typename === 'CoSeller' &&
                      <Dropdown.Item
                        as={Link}
                        to={`/users/${this.props.data.me._id}/buyorders`}>
                        Product Orders
                        <Label circular as="a" color="orange">
                          {(this.props.data.me as ICoSeller).totalBuyOrderReceipts}
                        </Label>
                      </Dropdown.Item>
                    }
                    {this.props.data.me.__typename === 'CoSeller' && <Dropdown.Divider />}
                    {this.props.data.me.__typename === 'Admin' &&
                      <Dropdown.Item
                        as={Link}
                        to={`/users/${this.props.data.me._id}/admin`}>
                        Admin
                      </Dropdown.Item>
                    }
                    {this.props.data.me.__typename === 'Admin' && <Dropdown.Divider />}
                    <Dropdown.Item
                        as={Link}
                        to={`/users/${this.props.data.me._id}/receipts`}>
                        Order receipts
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                        as={Link}
                        to={`/users/${this.props.data.me._id}/account`}>
                        Account setting
                    </Dropdown.Item>
                    <Dropdown.Item
                        as={Link}
                        to={`/users/${this.props.data.me._id}/payment`}>
                        Payment setting
                    </Dropdown.Item>
                    {this.props.data.me.__typename !== 'CoSeller' &&
                      <Dropdown.Item
                          as={Link}
                          to={`/users/${this.props.data.me._id}/coseller`}>
                          Become CoSeller
                      </Dropdown.Item>
                    }
                    <Dropdown.Divider />
                    <Dropdown.Item
                      as={({ className, children }) => <a className={className} href="/logout">{children}</a>}>
                      <Icon name="sign out" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                : <Menu.Item className={s.item}>
                  <a href="#" onClick={(e) => { this.props.mutate({}); }}>
                    <Icon name="lock" />
                    <FormattedMessage {...messages.logIn} />
                  </a>
                </Menu.Item>
              }
            </Menu.Menu>
          </Container>
        </Menu>
        <Container>
          <div className={cx(s.head, { [s.home]: this.props.location.pathname === '/' })}>
            <Link className={s.logoWrapper} to="/">
              <img
                className={s.logo}
                src={logoUrl}
                alt="Promize" />
            </Link>
            <div className={s.searchWrapper}>
              <SearchInput
                url={this.props.location.pathname}
                keywords={parseSearch(this.props.location) || []}
                onSubmit={this.onSearchSubmit.bind(this)}/>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

// FIXME: withRouter as decorators
export default withRouter<Header.Props>(Header);
