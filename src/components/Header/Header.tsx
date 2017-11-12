import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

// import LanguageSwitcher from '../LanguageSwitcher';
import { Link } from '../Link';
import { Navigation } from '../Navigation';
import * as s from './Header.css';
import * as logoUrl from './logo.png';
import * as logoUrl2x from './logo@2x.png';
import * as logoUrl3x from './logo@3x.png';
import * as search from './searchicon.png';
import * as arrowLeft from './arrowleft.png';
import * as arrowRight from './arrowright.png';


const messages = defineMessages({
  brand: {
    id: 'header.brand',
    defaultMessage: 'Your Company Brand',
    description: 'Brand name displayed in header',
  },
  bannerTitle: {
    id: 'header.banner.title',
    defaultMessage: 'Reacts',
    description: 'Title in page header',
  },
  bannerDesc: {
    id: 'header.banner.descsss',
    defaultMessage: 'Complex web apps made easy',
    description: 'Description in header',
  },
});

@withStyles(s)
export class Header extends React.Component<{}> {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          {/* <Navigation /> */}
          <div className={s.head}>
          <Link to="/">
            <img className={s.logo} src={logoUrl} srcSet={`${logoUrl} 1x, ${logoUrl2x} 2x, ${logoUrl3x} 3x`} alt="Promize" />            
          </Link>
          <form className={s.form}>
            <input className={s.searchInput} placeholder="Search"/>
          </form>

          </div>
          
          <div className={s.trendingBanner}>
            <div className={s.trendingHastags}>Trending Hastags</div>
            <div className={s.trendingButton}>
              <div className={s.circleButton}>
                <img className={s.buttonArrow} src={arrowLeft}/>
              </div>
              <div className={s.circleButton}>
                <img className={s.buttonArrow} src={arrowRight}/>
              </div>
            </div>
            <div className={s.trendingBlock}>
              <div className={s.trendingBlockText}>
                50 Percent Off
              </div>
              <div className={s.trendingBlockDecorate}/>
            </div>
            
          </div>
         
          {/* <LanguageSwitcher /> */}
          
        </div>
      </div>
    );
  }
}
