import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Button, Divider, Form } from 'semantic-ui-react';
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
        <Button
          fluid
          color="facebook"
        >
          <Icon name="facebook f" />
          Log in with Facebook
        </Button>
      </a>
    );
  }
}
