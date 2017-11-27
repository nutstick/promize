import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as s from './BottomFloatingButton.css';
import { ChildProps } from 'react-apollo/types';

namespace BottomFloatingButton {
  export type WithMessageModalQuery = ChildProps<{}, MessageModalQuery>;
  export type Props = ChildProps<WithMessageModalQuery, {}>;
}

@withStyles(s)
@graphql<{}, MessageModalQuery>(MESSAGEMODALQUERY)
@graphql<WithMessageModalQuery, {}>(TOGGLEMESSAGEMODALMUTATION)
export class BottomFloatingButton extends React.Component<BottomFloatingButton.Props> {
  public render() {
    return (
      <div>
        {
          <div>
            <div>
            </div>
          </div>
        }
        <div className={cx(s.float, s.show)}>
          {
            <a
              className={s.actionButton}
              href="#"
              onClick={() => this.props.mutate({})}
            >
              {this.props.children}
            </a>
          }
        </div>
      </div>
    );
  }
}
