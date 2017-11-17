import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Button, Divider, Form } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import * as s from './GoogleButton.css';

namespace GoogleButton {
  // export type Props = {};
}

@withStyles(s)
export class GoogleButton extends React.Component<{}> {
  public render() {
    return (
      <a href="/login/google">
        <Button>
          <Icon name="google" />
          Log in with Google
      </Button>
      </a>
    );
  }
}
