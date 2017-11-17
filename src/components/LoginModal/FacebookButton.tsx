import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import * as s from './FacebookButton.css';

namespace FacebookButton {
  // export type Props = {};
}

@withStyles(s)
export class FacebookButton extends React.Component<{}> {
  public render() {
    return (
      <a href="/login/facebook">
        <Icon name="facebook f" />
        Log in with Facebook
      </a>
    );
  }
}
