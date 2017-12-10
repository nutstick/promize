import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as MdChevronLeftIcon from 'react-icons/lib/md/chevron-left';
import * as MdChevronRightIcon from 'react-icons/lib/md/chevron-right';
import * as Waypoint from 'react-waypoint';
import { IconButton } from '../IconButton';
import { Item } from './Item';
import * as s from './Navigator.css';

export namespace Navigator {
  export interface ItemProps extends React.Props<any> {
    as?: React.ComponentClass<any>;
    [key: string]: any;
  }

  interface IProps {
    scrollable?: boolean;
    horizontal?: boolean;
    className?: string;
  }

  export type Props = IProps;

  export interface State {
    left: boolean;
    right: boolean;
  }
}

@withStyles(s)
export class Navigator extends React.Component<Navigator.Props, Navigator.State> {
  public static Item = Item;

  constructor(props) {
    super(props);
    this.state = {
      left: true,
      right: false,
    };
  }

  private isLeft() {
    return this.refs.menu && (this.refs.menu as Element).scrollLeft !== 0;
  }

  private isRight() {
    return this.refs.menu && Math.abs(
      (this.refs.menu as Element).scrollLeft +
      (this.refs.menu as Element).getBoundingClientRect().width -
      (this.refs.menu as Element).scrollWidth,
    ) > 1;
  }

  private easeInOutCubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  private onScrollPrev() {
    (this.refs.menu as Element).scrollTo((this.refs.menu as Element).scrollLeft -
      (this.refs.menu as Element).getBoundingClientRect().width - 20, 0);
  }

  private onScrollNext() {
    (this.refs.menu as Element).scrollTo((this.refs.menu as Element).scrollLeft +
      (this.refs.menu as Element).getBoundingClientRect().width - 20, 0);
  }

  private onScroll() {
    this.setState({
      left: this.isLeft(),
      right: this.isRight(),
    });
  }

  public componentDidMount() {
    this.setState({
      left: this.isLeft(),
      right: this.isRight(),
    });
  }

  public render() {
    // TODO: Scroll to active item in children components
    const { className, horizontal, scrollable, children } = this.props;

    return (
      <div className={cx(s.root, { [s.scrollable]: scrollable })}>
        {(scrollable && this.state.left) ?
          <IconButton className={s.arrow} onClick={this.onScrollPrev.bind(this)}>
            <MdChevronLeftIcon size={24} />
          </IconButton> :
          <a className={s.arrow}>
          </a>
        }
        <div
          ref="menu"
          className={cx({ className }, s.menu, { [s.horizontal]: horizontal })}
          onScroll={this.onScroll.bind(this)}>
          {children}
        </div>
        {(scrollable && this.state.right) ?
          <IconButton className={s.arrow} onClick={this.onScrollNext.bind(this)}>
            <MdChevronRightIcon size={24} />
          </IconButton> :
          <a className={s.arrow}>
          </a>
        }
      </div>
    );
  }
}
