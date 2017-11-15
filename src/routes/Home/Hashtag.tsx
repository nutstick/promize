import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Link } from 'react-router-dom';
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
      <Link className={s.root} to={`/search?keyword=${this.props.text}`}>
        <div className={s.content}>
          <span
            className={s.hashtag}
            style={{ color: this.props.hashtagColor }}
          >#</span>
          {this.props.text || this.props.children}
        </div>
      </Link>
    );
  }
}
