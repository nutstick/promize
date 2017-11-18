import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { defineMessages, FormattedMessage, IntlProvider } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Container, Icon, Image, Input, Menu, Dropdown } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import * as TOGGLELOGINMODALMUTATION from '../../apollo/login/ToggleLoginModalMutation.gql';
import { parseSearch } from '../../core/urlParser';
import { ICoSeller, IUser } from '../../schema/types/User';
import { LanguageSwitcher } from '../LanguageSwitcher';
import * as s from './Header.css';
import * as MEQUERY from './MeQuery.gql';
import * as logoUrl from './promizeLogoWhite.svg';

namespace Header {
  export type WithRouter = RouteComponentProps<{}>;
  export type WithToggleLoginMutation = ChildProps<WithRouter, {}>;
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
@graphql(TOGGLELOGINMODALMUTATION)
@graphql(MEQUERY)
export class Header extends React.Component<Header.Props, Header.State> {
  static contextTypes = {
    intl: IntlProvider.childContextTypes.intl,
  };

  constructor(props) {
    super(props);

    this.state = {
      search: parseSearch(this.props.location) || '',
    };
  }

  private onSearchChanged(event: React.SyntheticEvent<HTMLInputElement>): void {
    this.setState({
      search: (event.target as any).value,
    });
  }

  private onSearchKeyPress(event: React.KeyboardEventHandler<HTMLInputElement>): void {
    if ((event as any).key === 'Enter') {
      this.props.history.push(`/search?keyword=${this.state.search}`);
    }
  }

  private onSearchButtonClicked(event: React.SyntheticEvent<HTMLInputElement>): void {
    this.props.history.push(`/search?keyword=${this.state.search}`);
  }

  private onRouteChanged() {
    const search = parseSearch(this.props.location);
    if (search) {
      this.setState({
        search,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  public render() {
    const trigger = this.props.data.me && (
      <span>
        <Image avatar src={this.props.data.me.avatar} /> {this.props.data.me.firstName}
      </span>
    );

    return (
      <div className={cx(s.root, s.bg)}>
        <Menu className={s.menu} size="small" borderless>
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
                    <Dropdown.Header>
                      <div>
                        <Image avatar src={this.props.data.me.avatar} /> Hi! {this.props.data.me.firstName}
                      </div>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    {/* TODO: Link on Menu */}
                    {(this.props.data.me as ICoSeller).coseller && <Dropdown.Item>Create new product</Dropdown.Item>}
                    {(this.props.data.me as ICoSeller).coseller && <Dropdown.Item>My Products</Dropdown.Item>}
                    {(this.props.data.me as ICoSeller).coseller && <Dropdown.Item>Product Orders</Dropdown.Item>}
                    {(this.props.data.me as ICoSeller).coseller && <Dropdown.Divider />}
                    <Dropdown.Item>Order receipts</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Account setting</Dropdown.Item>
                    <Dropdown.Item>Payment setting</Dropdown.Item>
                    {!(this.props.data.me as ICoSeller).coseller && <Dropdown.Item>Become a CoSeller</Dropdown.Item>}
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
              <Input
                className={s.searchInput}
                action
                placeholder={this.context.intl.formatMessage(messages.search)}>
                <input
                  value={this.state.search}
                  onChange={this.onSearchChanged.bind(this)}
                  onKeyPress={this.onSearchKeyPress.bind(this)}/>
                <Button
                  className={s.searchButton}
                  type="submit"
                  icon="search"
                  color="black"
                  onClick={this.onSearchButtonClicked.bind(this)} />
              </Input>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

// FIXME: withRouter as decorators
export default withRouter<{}>(Header);
