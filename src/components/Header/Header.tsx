import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
// import { defineMessages } from 'react-intl';
// import LanguageSwitcher from '../LanguageSwitcher';
import { Link } from 'react-router-dom';
import * as semanticsCss from 'semantic-ui-css/semantic.min.css';
import { Container, Icon, Input, Menu } from 'semantic-ui-react';
import * as s from './Header.css';
import * as logoUrl from './logo.png';
import * as logoUrl2x from './logo@2x.png';
import * as logoUrl3x from './logo@3x.png';

namespace Header {
  export type Props = RouteComponentProps<{}>;
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

@withStyles(semanticsCss, s)
export class Header extends React.Component<Header.Props> {
  render() {
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
          {this.props.location.pathname === '/' ? (
            <div className={cx(s.head, s.home)}>
              <Link className={s.logoWrapper} to="/">
                <img
                  className={s.logo}
                  src={logoUrl}
                  srcSet={`${logoUrl} 1x, ${logoUrl2x} 2x, ${logoUrl3x} 3x`} alt="Promize" />
              </Link>
              <div className={s.searchWrapper}>
                <Input className={s.searchInput} icon="search" placeholder="Search..." />
              </div>
            </div>
          ) : (
            <div className={s.head}>
              {/* Header */}
              <Link className={s.logoWrapper} to="/">
                <img
                  className={s.logo}
                  src={logoUrl}
                  srcSet={`${logoUrl} 1x, ${logoUrl2x} 2x, ${logoUrl3x} 3x`} alt="Promize" />
              </Link>
              <div className={s.searchWrapper}>
                <Input className={s.searchInput} icon="search" placeholder="Search..." />
              </div>
            </div>
          )}
        </Container>
      </div>
    );
  }
}

export const HeaderWithRouter = withRouter<{}>(Header);
