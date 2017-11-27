import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { MessagesLayout } from '../MessagesLayout';
import * as s from './BottomFloatingButton.css';

namespace BottomFloatingButton {
  export type Props = any;

  export interface State {
    show: boolean;
  }
}

@withStyles(s)
export class BottomFloatingButton extends React.Component<BottomFloatingButton.Props, BottomFloatingButton.State> {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }
  public render() {
    return (
      <div>
        {this.state.show &&
          <MessagesLayout />
        }
        <div className={cx(s.float, s.show)}>
          {<a
            className={s.actionButton}
            href="#"
            onClick={() => {
              this.setState({ show: !this.state.show });
            }}>
            {this.props.children}
          </a>}
        </div>
      </div>
    );
  }
}
