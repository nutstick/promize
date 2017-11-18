import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as MdAvTimerIcon from 'react-icons/lib/md/av-timer';
import * as MdDashboardIcon from 'react-icons/lib/md/dashboard';
import * as HotIcon from 'react-icons/lib/md/whatshot';
import { defineMessages, FormattedMessage, IntlProvider } from 'react-intl';
import StackGrid, { easings, transitions } from 'react-stack-grid';
import { Card, contentClass, headingClass } from '../../components/Card';
import { Category } from './Category';
import { Hashtag } from './Hashtag';
import * as s from './Home.css';

import * as cameraImage from './camera.svg';
import * as clothsImage from './clothes.svg';
import * as lipstickImage from './cosmetics.svg';
import * as electronicsImage from './electronic.svg';
import * as gameImage from './gamepad.svg';
import * as headphonesImage from './headphones.svg';
import * as cellphoneImage from './smartphone.svg';
import * as washingMachineImage from './washing-machine.svg';

const transition = transitions.scaleDown;

// TODO: Change to real picture
const itemModifier = [
  'gray',
  'gray-light',
  'gray-dark',
  'yellow',
  'pink',
  'purple',
];

export namespace Home {
  export interface IProductsQuery {
    products: any;
  }

  export interface IItem {
    id: string;
    height: number;
    modifier: string;
  }

  export interface State {
    items: IItem[];
  }
  export type Props = any;
}

const messages = defineMessages({
  trendingHashtags: {
    id: 'home.trendingHashtags',
    defaultMessage: 'Trending Hashtags',
    description: 'Trending Hashtags display in home page',
  },
  category: {
    id: 'home.category',
    defaultMessage: 'Category',
    description: 'Category display in home page',
  },
  endingSoon: {
    id: 'home.endingSoon',
    defaultMessage: 'Ending Soon!!',
    description: 'Ending Soon display in home page',
  },
  cloths: {
    id: 'header.category.cloths',
    defaultMessage: 'Cloths',
    description: 'Cloths category',
  },
  beauty: {
    id: 'header.category.beauty',
    defaultMessage: 'Beauty',
    description: 'Beauty category',
  },
  audiophile: {
    id: 'header.category.audiophile',
    defaultMessage: 'Audiophile',
    description: 'Audiophile category',
  },
  cellphone: {
    id: 'header.category.cellphone',
    defaultMessage: 'Cellphone',
    description: 'Cellphone category',
  },
  tech: {
    id: 'header.category.tech',
    defaultMessage: 'Tech',
    description: 'Tech category',
  },
  games: {
    id: 'header.category.games',
    defaultMessage: 'Games',
    description: 'Games category',
  },
  photography: {
    id: 'header.category.photography',
    defaultMessage: 'Photography',
    description: 'Photography category',
  },
  electronics: {
    id: 'header.category.electronics',
    defaultMessage: 'Electronics',
    description: 'Electronics category',
  },
});

@withStyles(s)
export class Home extends React.Component<Home.Props> {
  static contextTypes = {
    intl: IntlProvider.childContextTypes.intl,
  };

  private createItem(): Home.IItem {
    const id = Math.random().toString(36).substr(2, 9);
    const height = Math.floor((Math.random() * (300 - 80)) + 80);
    const modifier = itemModifier[Math.floor(Math.random() * itemModifier.length)];

    return { id, height, modifier };
  }

  public componentDidMount() {
    document.title = 'Home';
  }

  public render() {
    const categoryList = [
      {
        icon: clothsImage,
        text: this.context.intl.formatMessage(messages.cloths),
      },
      {
        icon: lipstickImage,
        text: this.context.intl.formatMessage(messages.beauty),
      },
      {
        icon: headphonesImage,
        text: this.context.intl.formatMessage(messages.audiophile),
      },
      {
        icon: cellphoneImage,
        text: this.context.intl.formatMessage(messages.cellphone),
      },
      {
        icon: electronicsImage,
        text: this.context.intl.formatMessage(messages.tech),
      },
      {
        icon: gameImage,
        text: this.context.intl.formatMessage(messages.games),
      },
      {
        icon: cameraImage,
        text: this.context.intl.formatMessage(messages.photography),
      },
      {
        icon: washingMachineImage,
        text: this.context.intl.formatMessage(messages.electronics),
      },
    ];

    const items = Array.apply(null, Array(10)).map(() => this.createItem());

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Card>
            <div className={headingClass}>
              <HotIcon size={25} style={{
                marginRight: 2.5,
              }} color="#ff9521" />
              <span><FormattedMessage {...messages.trendingHashtags} /></span>
            </div>
            <div className={cx(contentClass, s.hashtags)}>
              {['End soon!', '50% Off', 'uniqlo', 'HandM', 'AIIZ', 'GAP', 'Crocs', 'anello', 'kanken',
                'Chulalongkorn', 'SE!!!']
                .map((text) => (<Hashtag key={`HASHTAG-${text}`} text={text} />))}
            </div>

            <div className={headingClass}>
              <MdDashboardIcon size={25} style={{
                marginRight: 2.5,
              }} color="#ff9521" />
              <span><FormattedMessage {...messages.category} /></span>
            </div>
            <div className={cx(contentClass, s.categoryList)}>
              {categoryList.map((category) => (
                <Category key={category.text} className={s.category} icon={category.icon} text={category.text} />
              ))}
            </div>

            <div className={cx(headingClass)}>
              <MdAvTimerIcon size={25} style={{
                marginRight: 2.5,
              }} color="#ff9521" />
              <span><FormattedMessage {...messages.endingSoon} /></span>
            </div>

            <div className={cx(contentClass, s.productList)}>
              <StackGrid
                duration={480}
                columnWidth={200}
                gutterWidth={5}
                gutterHeight={5}
                easing={easings.quartOut}
                appear={transition.appear}
                appeared={transition.appeared}
                enter={transition.enter}
                entered={transition.entered}
                leaved={transition.leaved}
                enableSSR={false}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={cx(s.item, s[`item--${item.modifier}`])}
                    style={{ height: item.height }}
                  />
                ))}
              </StackGrid>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
