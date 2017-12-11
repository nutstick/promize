import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Ripple.css';

export namespace Ripple {
  export interface IProps {
    cursorPos: {
      top?: any,
      left?: any,
      time?: number,
    };
    scale?: number;
  }

  export type Props = IProps;

  export interface State {
    animate: boolean;
    width: number;
    height: number;
    top: number;
    left: number;
  }
}

@withStyles(s)
export class Ripple extends React.Component<Ripple.Props, Ripple.State> {
  constructor(props) {
    super(props);

    this.state = {
      animate: false,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    };
  }

  reppling(cursorPos) {
    // Get the element
    const ripple = this.refs.ripple;
    const button = (ripple as any).parentElement;

    const buttonPos = button.getBoundingClientRect();

    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;

    // Make a Square Ripple
    const rippleWidthShouldBe = Math.max(buttonHeight, buttonWidth);

    // Make Ripple Position to be center
    const centerize = rippleWidthShouldBe / 2;

    this.setState({
      animate: true,
      width: rippleWidthShouldBe,
      height: rippleWidthShouldBe,
      top: cursorPos.top - buttonPos.top - centerize,
      left: cursorPos.left - buttonPos.left - centerize,
    });
  }

  componentWillReceiveProps(nextProps) {
    const cursorPos = nextProps.cursorPos;

    // Prevent Component duplicates do ripple effect at the same time
    if (cursorPos.time !== this.props.cursorPos.time) {
      // If Has Animated, set state to "false" First
      if (this.state.animate) {
        this.setState({ animate: false }, () => {
          this.reppling(cursorPos);
        });
      } else { this.reppling(cursorPos); }
    }
  }
  public render() {
    const scale = this.props.scale || 3;
    return (
      <div className={cx(s.ripple, this.state.animate ? scale === 3 ? s.x3 : s.x1 : '' )} ref="ripple" style={{
          top: `${this.state.top}px`,
          left: `${this.state.left}px`,
          width: `${this.state.width}px`,
          height: `${this.state.height}px`,
      }}></div>
    );
  }
}
