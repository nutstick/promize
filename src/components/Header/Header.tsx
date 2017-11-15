import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
// import { defineMessages } from 'react-intl';
// import LanguageSwitcher from '../LanguageSwitcher';
import { Link } from 'react-router-dom';
import { Button, Container, Icon, Input, Menu } from 'semantic-ui-react';
import { parseSearch } from '../../core/urlParser';
import * as s from './Header.css';
import * as logoUrl from './promizeLogoWhite.svg';

namespace Header {
  export type Props = RouteComponentProps<{}>;

  export interface State {
    search?: string | string[];
  }
}

// const messages = defineMessages({
//   brand: {
//     id: 'header.brand',
//     defaultMessage: 'Your Company Brand',
//     description: 'Brand name displayed in header',
//   },
//   bannerTitle: {
//     id: 'header.banner.title',
//     defaultMessage: 'Reacts',
//     description: 'Title in page header',
//   },
//   bannerDesc: {
//     id: 'header.banner.descsss',
//     defaultMessage: 'Complex web apps made easy',
//     description: 'Description in header',
//   },
// });

@withStyles(s)
export class Header extends React.Component<Header.Props, Header.State> {
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
              Welcome to Promize!
              <div className={s.hideOnMobile}>
                <span className={s.highlightedText}>Join Free</span>
                or
                <span className={s.highlightedText}>Sign in</span>
              </div>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item className={s.item}>
                <Link to="/login">
                  <Icon name="lock" /> Login
                </Link>
              </Menu.Item>
              <Menu.Item>
                {/* TODO: Language Switcher */}
                English
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
                placeholder="Search...">
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
