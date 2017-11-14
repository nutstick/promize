import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Hashtag.css';

export namespace Hashtag {
  interface IProps {
    text?: string;
    hashtagColor?: string;
  }
  export type Props = IProps;
}

@withStyles(s)
export class Hashtag extends React.Component<Hashtag.Props> {
  public render() {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <span
            className={s.hashtag}
            style={{ color: this.props.hashtagColor }}
          >#</span>
          {this.props.text || this.props.children}
        </div>
      </div>
    );
  }
}
