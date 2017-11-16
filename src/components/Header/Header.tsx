import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { defineMessages, FormattedMessage, IntlProvider } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Container, Icon, Input, Menu } from 'semantic-ui-react';
import { parseSearch } from '../../core/urlParser';
import { LanguageSwitcher } from '../LanguageSwitcher';
import * as s from './Header.css';
import * as logoUrl from './promizeLogoWhite.svg';

namespace Header {
  export type Props = RouteComponentProps<{}>;

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
    return (
      <div className={cx(s.root, s.bg)}>
        <Menu className={s.menu} size="small" borderless>
          <Container>
            <Menu.Item className={s.welcome}as="welcome">
              <FormattedMessage {...messages.welcome} />
              <div className={s.hideOnMobile}>
                <span className={s.highlightedText}>
                  <FormattedMessage {...messages.join} />
                </span>
                or
                <span className={s.highlightedText}>
                  <FormattedMessage {...messages.logIn} />
                </span>
              </div>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item className={s.item}>
                <Link to="/login">
                  <Icon name="lock" />
                  <FormattedMessage {...messages.logIn} />
                </Link>
              </Menu.Item>
              <Menu.Item>
                {/* TODO: Language Switcher */}
                <LanguageSwitcher />
              </Menu.Item>
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

export default withRouter<{}>(Header);
