import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as MdAvTimerIcon from 'react-icons/lib/md/av-timer';
import * as MdDashboardIcon from 'react-icons/lib/md/dashboard';
import * as HotIcon from 'react-icons/lib/md/whatshot';
import StackGrid, { easings, transitions } from 'react-stack-grid';
import { Card, contentClass, headingClass } from '../../components/Card';
import { Category } from './Category';
import { Hashtag } from './Hashtag';
import * as s from './Home.css';

import * as cellphoneImage from './smartphone.svg';
import * as clothsImage from './clothes.svg';
import * as electronicsImage from './electronic.svg';
import * as gameImage from './gamepad.svg';
import * as headphonesImage from './headphones.svg';
import * as lipstickImage from './cosmetics.svg';
import * as cameraImage from './camera.svg';
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

@withStyles(s)
export class Home extends React.Component<Home.Props> {
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
        text: 'Cloths',
      },
      {
        icon: lipstickImage,
        text: 'Beauty',
      },
      {
        icon: headphonesImage,
        text: 'Audiophile',
      },
      {
        icon: cellphoneImage,
        text: 'Cellphone',
      },
      {
        icon: electronicsImage,
        text: 'Tech',
      },
      {
        icon: gameImage,
        text: 'Games',
      },
      {
        icon: cameraImage,
        text: 'Photography',
      },
      {
        icon: washingMachineImage,
        text: 'Electronics',
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
              <span>Trending Hashtags</span>
            </div>
            <div className={cx(contentClass, s.hashtags)}>
              <Hashtag text="End soon!" />
              <Hashtag text="50% Off" />
              <Hashtag text="Starbuck 1 FREE 1" />
              <Hashtag text="SE!!!" />
              <Hashtag text="TestTextBabLong" />
              <Hashtag text="TestTextBabLongLong" />
              <Hashtag text="คำไทย" />
              <Hashtag text="โปรโมชั่นบัตรเครดิตอิออน" />
              <Hashtag text="Chulalongkorn" />
            </div>

            <div className={headingClass}>
              <MdDashboardIcon size={25} style={{
                marginRight: 2.5,
              }} color="#ff9521" />
              <span>Category</span>
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
              <span>Ending soon!!</span>
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
                enableSSR={true}
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
