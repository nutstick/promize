import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as s from './Category.css';

export namespace Category {
  interface IProps {
    icon: string;
    text: string;
    className: string;
  }
  export type Props = IProps;
}

@withStyles(s)
export class Category extends React.Component<Category.Props> {
  public render() {
    return (
      <Link className={cx(s.root, this.props.className)} to={`/search?keywords=[{keyword:${this.props.text}}]`}>
        <img
          className={s.icon}
          src={this.props.icon}
          alt={this.props.text} />
        <div className={s.content}>
          {this.props.text || this.props.children}
        </div>
      </Link>
    );
  }
}
