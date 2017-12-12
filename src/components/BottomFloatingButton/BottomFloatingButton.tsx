import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { graphql } from '../../apollo/graphql';
import * as SETTRADEROOMMODALMUTATION from '../../apollo/tradeRoomModal/SetTradeRoomModal.gql';
import { MessagesLayout } from '../MessagesLayout';
import * as s from './BottomFloatingButton.css';

namespace BottomFloatingButton {
  export interface IProps {
    show: boolean;
  }

  export type Props = ChildProps<IProps, {}>;
}

@withStyles(s)
@graphql<{}, {}>(SETTRADEROOMMODALMUTATION)
export class BottomFloatingButton extends React.Component<BottomFloatingButton.Props> {
  constructor(props) {
    super(props);
  }
  public render() {
    return (
      <div>
        {this.props.show &&
          <MessagesLayout />
        }
        <div className={cx(s.float, s.show)}>
          {<a
            className={s.actionButton}
            href="#"
            onClick={() => {
              this.props.mutate({ variables: { show: !this.props.show } });
            }}>
            {this.props.children}
          </a>}
        </div>
      </div>
    );
  }
}
