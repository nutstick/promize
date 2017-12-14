import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps, MutationFunc } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Button, Divider, Form, Message } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import * as TOGGLELOGINMODALMUTATION from '../../apollo/login/ToggleLoginModalMutation.gql';
import { FacebookButton } from './FacebookButton';
import { GoogleButton } from './GoogleButton';
import * as s from './LoginModal.css';
import * as LOGINMUTATION from './LoginMutation.gql';

namespace LoginModal {
  type LoginMutation<P> = P & {
    login?: MutationFunc<{}>;
  };
  export type WithToggleLoginModalMutation = LoginMutation<{}>;

  export type Props = ChildProps<WithToggleLoginModalMutation, {}>;

  export interface State {
    logining: boolean;
    email?: string;
    emailError: boolean;
    password?: string;
    passwordError: boolean;
    error?: Error;
  }
}

@withStyles(s)
@graphql<{}, {}>(TOGGLELOGINMODALMUTATION)
@graphql<{}, {}>(LOGINMUTATION, { name: 'login' })
export class LoginModal extends React.Component<LoginModal.Props, LoginModal.State> {
  constructor(props) {
    super(props);

    this.state = {
      logining: false,
      emailError: false,
      passwordError: false,
    };
  }

  private onBackgroundClick(e: React.MouseEvent<any>) {
    this.props.mutate({});
  }

  private onInputChange(field, required, e, { value }) {
    if (value) {
      this.setState({
        ...this.state,
        [field]: value,
        ...required && {
          [`${field}Error`]: false,
        },
      });
    } else {
      this.setState({
        ...this.state,
        [field]: value,
        ...required && {
          [`${field}Error`]: true,
        },
      });
    }
  }

  private login() {
    // Error check before procede
    const error: {
      emailError?: boolean;
      passwordError?: boolean;
    } = {};
    if (!this.state.email) {
      error.emailError = true;
    }
    if (!this.state.password) {
      error.passwordError = true;
    }

    if (Object.keys(error).length === 0) {
      // Set Login button to loading state
      this.setState({
        logining: true,
      });

      this.props.login({
        variables: {
          email: this.state.email,
          password: this.state.password,
        },
        refetchQueries: ['Me', 'TradeRooms', 'UserAndMe'],
      })
        .then(() => {
          this.props.mutate({});
        })
        .catch((err) => {
          this.setState({
            logining: false,
            error: err,
          });
        });
    } else {
      this.setState({
        ...this.state,
        ...error,
      });
    }
  }

  public render() {
    return (
      <div className={s.root} onClick={this.onBackgroundClick.bind(this)}>
        <div className={s.modal} onClick={(e) => e.stopPropagation()}>
          <FacebookButton />
          <p style={{ margin: 8 }}></p>
          <GoogleButton />
          <Divider horizontal>or</Divider>
          <Form onSubmit={this.login.bind(this)} error={!!this.state.error}>
            {this.state.error && <Message
              error
              content="Incorrect login, email or password incorrect"
            />}
            <Form.Input
              required
              label="Email"
              placeholder="Email"
              error={this.state.emailError}
              onChange={this.onInputChange.bind(this, 'email', true)} />
            <Form.Input
              required
              label="Password"
              placeholder="Password"
              error={this.state.passwordError}
              type="password"
              onChange={this.onInputChange.bind(this, 'password', true)} />
            <Button type="submit" fluid secondary loading={this.state.logining}> Log in </Button>
            <br />
            <div className={s.forgetPassword}>
              <Link to="/forget-password" >Forget Password</Link>
            </div>
          </Form>
          <hr />
          <div className={s.signUp}>
            Don't have an account?
            <Link to="/register" onClick={this.onBackgroundClick.bind(this)} style={{
              paddingLeft: 10,
            }}>Sign up</Link>
          </div>
        </div>
      </div>
    );
  }
}
