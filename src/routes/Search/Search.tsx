import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as FaFilterIcon from 'react-icons/lib/fa/filter';
import * as MdSortIcon from 'react-icons/lib/md/sort';
import StackGrid, { easings, transitions } from 'react-stack-grid';
import { Sticky } from 'semantic-ui-react';
import { Card, contentClass, headingClass } from '../../components/Card';
import * as s from './Search.css';

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

namespace Search {
  export interface IItem {
    id: string;
    height: number;
    modifier: string;
  }

  export type Props = any;
}

@withStyles(s)
export class Search extends React.Component<Search.Props> {
  private createItem(): Search.IItem {
    const id = Math.random().toString(36).substr(2, 9);
    const height = Math.floor((Math.random() * (300 - 100)) + 100);
    const modifier = itemModifier[Math.floor(Math.random() * itemModifier.length)];

    return { id, height, modifier };
  }

  public componentDidMount() {
    document.title = 'Results';
  }

  public render() {
    const items = Array.apply(null, Array(100)).map(() => this.createItem());

    return (
      <div className={s.root}>
        <Sticky className={s.left} bottomOffset={0}>
          <Card>
            <div className={headingClass}>
              <FaFilterIcon size={18} style={{
                marginRight: 2.5,
              }} color="#ff9521" />
              <span>Search Filter</span>
            </div>
            <div className={s.content}>
              <span>Shipped From</span>
              <ul>
                <li>Metro Manila</li>
                <li>North Luzon</li>
                <li>South Luzon</li>
                <li>Visayas</li>
              </ul>
              <hr />
              <span>Condition</span>
              <ul>
                <li>New Prodcut</li>
                <li>Buy now</li>
              </ul>
              <hr />
              <span>Price Range</span>
              <ul>
                <li>Min</li>
                <li>Max</li>
              </ul>
            </div>

            <hr />
            <div className={headingClass}>
              <MdSortIcon size={18} style={{
                marginRight: 2.5,
              }} color="#ff9521" />
              <span>Sort</span>
            </div>
            <div className={s.content}>
            </div>
          </Card>
        </Sticky>
        <Card className={s.results}>
          <div className={cx(contentClass, s.productList)}>
            <StackGrid
              duration={480}
              columnWidth={180}
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
    );
  }
}
