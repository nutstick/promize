import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo/types';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Grid, Image } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { Card } from '../../components/Card';
import * as s from './Register.css';
import * as REGISTERMUTATION from './RegisterMutation.gql';

namespace Register {
  export type Props = ChildProps<RouteComponentProps<{}>, {}>;

  export interface State {
    firstName?: string;
    firstNameError: boolean;
    middleName?: string;
    lastName?: string;
    lastNameError: boolean;
    email?: string;
    emailError: boolean;
    password?: string;
    passwordError: boolean;
    passwordConfirm?: string;
    passwordConfirmError: boolean | string;
    gender?: string;
    tel?: string;
    checkbox?: boolean;
    checkboxError: boolean;

    registering: boolean;

    error?: Error | Error[];
  }
}

@withStyles(s)
@graphql(REGISTERMUTATION)
export class Register extends React.Component<Register.Props, Register.State> {
  constructor(props) {
    super(props);

    this.state = {
      firstNameError: false,
      lastNameError: false,
      emailError: false,
      passwordError: false,
      passwordConfirmError: false,
      checkbox: false,
      checkboxError: false,
      registering: false,
    };
  }

  public componentDidMount() {
    document.title = 'Register';
  }

  private onInputChange(field, required, e, { value }) {
    if (field === 'passwordConfirm' && this.state.password && value !== this.state.password) {
      return this.setState({
        passwordConfirm: value,
        passwordConfirmError: 'Password not match',
      });
    }
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

  private onCheckboxChange(field, required, e, { checked }) {
    if (checked) {
      this.setState({
        ...this.state,
        [field]: checked,
        ...required && {
          [`${field}Error`]: false,
        },
      });
    } else {
      this.setState({
        ...this.state,
        [field]: checked,
        ...required && {
          [`${field}Error`]: true,
        },
      });
    }
  }

  private register() {
    // Error check before procede
    const error: {
      firstNameError?: boolean,
      lastNameError?: boolean,
      emailError?: boolean,
      passwordError?: boolean,
      passwordConfirmError?: boolean,
      checkboxError?: boolean;
    } = {};
    if (!this.state.firstName) {
      error.firstNameError = true;
    }
    if (!this.state.lastName) {
      error.lastNameError = true;
    }
    if (!this.state.email) {
      error.emailError = true;
    }
    if (!this.state.password) {
      error.passwordError = true;
    }
    if (!this.state.passwordConfirm) {
      error.passwordConfirmError = true;
    }
    if (!this.state.checkbox) {
      error.checkboxError = true;
    }
    if (this.state.password !== this.state.passwordConfirm) {
      error.passwordConfirmError = true;
    }

    if (Object.keys(error).length === 0) {
      // Set Login button to loading state
      this.setState({
        registering: true,
      });

      this.props.mutate({
        variables: {
          input: {
            firstName: this.state.firstName,
            middleName: this.state.middleName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            gender: this.state.gender,
            telNumber: this.state.tel,
          },
        },
        refetchQueries: ['Me', 'TradeRooms', 'UserAndMe'],
      })
        .then(() => {
          this.props.history.push('/');
        })
        .catch((err) => {
          this.setState({
            registering: false,
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

    const genderOptions = [
      { key: 'm', text: 'Male', value: 'male' },
      { key: 'f', text: 'Female', value: 'female' },
    ];

    return (
      <div className={s.root}>
        <Card>
          <div className={s.container}>
            <Form onSubmit={this.register.bind(this)}>
              <h3>Register</h3>
              <hr/>
              <Grid>
                <Grid.Column mobile={16} tablet={6} computer={6}>
                  <Image src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                        size="medium"
                        circular
                  />
                </Grid.Column>
                <Grid.Column mobile={16} tablet={10} computer={10}>
                  <Form.Input
                    required
                    label="First Name"
                    placeholder="First Name"
                    error={this.state.firstNameError}
                    onChange={this.onInputChange.bind(this, 'firstName', true)} />
                  <Form.Input
                    label="Middle Name"
                    placeholder="Middle Name"
                    onChange={this.onInputChange.bind(this, 'middleName', false)} />
                  <Form.Input
                    required
                    label="Last Name"
                    placeholder="Last Name"
                    error={this.state.lastNameError}
                    onChange={this.onInputChange.bind(this, 'lastName', true)} />
                </Grid.Column>
              </Grid>
              <br/>
              <h4>General Information</h4>
              <hr/>
              <Form.Input
                fluid
                required
                label="Email"
                placeholder="Email"
                error={this.state.emailError}
                onChange={this.onInputChange.bind(this, 'email', true)} />
              <Form.Input
                fluid
                required
                label="Password"
                placeholder="Password"
                error={this.state.passwordError}
                type="password"
                onChange={this.onInputChange.bind(this, 'password', true)} />
              <Form.Input
                fluid
                required
                label="Password confirmation"
                placeholder="Password confirmation"
                error={!!this.state.passwordConfirmError}
                type="password"
                onChange={this.onInputChange.bind(this, 'passwordConfirm', true)} />
              <Form.Select
                fluid
                label="Gender"
                options={genderOptions}
                placeholder="Gender"
                onChange={this.onInputChange.bind(this, 'gender', false)} />
              <Form.Input
                fluid
                label="Phone"
                placeholder="Phone"
                onChange={this.onInputChange.bind(this, 'tel', false)}/>

              <Form.Checkbox
                required
                error={this.state.checkboxError}
                onChange={this.onCheckboxChange.bind(this, 'checkbox', false)}
                label="I agree to the Terms and Conditions" />
              <Form.Button type="submit">Submit</Form.Button>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}
