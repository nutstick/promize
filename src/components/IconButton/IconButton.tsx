import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Ripple } from '../Ripple';
import * as s from './IconButton.css';

export namespace IconButton {
  export interface IProps {
    className?: string;
    scale?: number;
    onClick?: (e) => void;
  }

  export type Props = IProps;

  export interface State {
    cursorPos: {
      top?: any,
      left?: any,
      time?: number,
    };
  }
}

@withStyles(s)
export class IconButton extends React.Component<IconButton.Props, IconButton.State> {
  constructor(props) {
    super(props);

    this.state = {
      cursorPos: {},
    };
  }

  private onClick(e) {
    const { x, y, width, height } = e.target.getBoundingClientRect();
    const cursorPos = {
      top: y + height / 2,
      left: x + width / 2,
      // Prevent Component duplicates do ripple effect at the same time
      time: Date.now(),
    };
    this.setState({ cursorPos });

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
  public render() {
    return (
      <a
        className={cx(this.props.className, s.root)}
        onMouseUp={this.onClick.bind(this)}
        // onTouchEnd={this.onClick.bind(this)}
      >
        {this.props.children}
        <Ripple scale={this.props.scale || 1} cursorPos={this.state.cursorPos} />
      </a>
    );
  }
}
