import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Button, Divider, Form } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import * as TOGGLELOGINMODALMUTATION from '../../apollo/login/ToggleLoginModalMutation.gql';
import { FacebookButton } from './FacebookButton';
import { GoogleButton } from './GoogleButton';
import * as s from './LoginModal.css';

namespace LoginModal {
  export type Props = ChildProps<{}, {}>;
}

@withStyles(s)
@graphql(TOGGLELOGINMODALMUTATION)
export class LoginModal extends React.Component<LoginModal.Props> {
  private onBackgroundClick(e: React.MouseEvent<any>) {
    this.props.mutate({});
  }
  public render() {
    return (
      <div className={s.root} onClick={this.onBackgroundClick.bind(this)}>
        <div className={s.modal} onClick={(e) => e.stopPropagation()}>
          <FacebookButton />
          <GoogleButton />
          <Divider horizontal>or</Divider>
          <Form>
            <Form.Field>
              <label>Email</label>
              <input placeholder="Email" />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input placeholder="Password" />
            </Form.Field>
            <Button type="submit">Login</Button>
            <Link to="/forget-password">Forget Password</Link>
          </Form>
          <hr />
          <div>
            Don't have an account?
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    );
  }
}
