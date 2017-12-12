import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Item.css';

export namespace Item {
  export interface IProps {
    as?: React.ComponentClass<any>;
    [key: string]: any;
  }

  export type Props = IProps;
}

@withStyles(s)
export class Item extends React.Component<Item.Props> {
  public render() {
    const { as, ...props } = this.props;
    if (this.props.as) {
      const Element = this.props.as;
      return (
        <Element className={s.item} role="tab" {...props}>
          {this.props.children}
        </Element>
      );
    } else {
      return (
        <a className={s.item} role="tab" {...props}>
          {this.props.children}
        </a>
      );
    }
  }
}
