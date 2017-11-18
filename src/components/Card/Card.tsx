import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Card.css';

namespace Card {
  interface IProps {
    className?: string;
  }

  export type Props = IProps;
}

@withStyles(s)
export class Card extends React.Component<Card.Props, {}> {
  public render() {
    return (
      <div className={cx(s.card, this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}

export const headingClass = s.heading;

export const contentClass = s.content;
