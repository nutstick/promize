import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import * as s from './FacebookButton.css';

namespace FacebookButton {
  // export type Props = {};
}

@withStyles(s)
export class FacebookButton extends React.Component<{}> {
  public render() {
    return (
      <Button
        fluid
        color="facebook"
      >
        <a href="/login/facebook">
          <i><Icon name="facebook f" /></i>
          Log in with Facebook
      </a>
      </Button>
    );
  }
}
