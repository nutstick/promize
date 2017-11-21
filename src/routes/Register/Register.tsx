import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Button, Checkbox, Form, Grid, Image } from 'semantic-ui-react'
import { Card } from '../../components/Card';
import * as s from './Register.css';

namespace Register {
  export type Props = any;
}

@withStyles(s)
export class Register extends React.Component<Register.Props> {
  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    document.title = 'Register';
  }

  public render() {

    const genderOptions = [
      { key: 'm', text: 'Male', value: 'male' },
      { key: 'f', text: 'Female', value: 'female' },
    ]

    return (
      <div className={s.root}>
        <Card>
          <div className={s.container}>
            <Form>
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
                  <Form.Field>
                    <label>First Name</label>
                    <input placeholder="First Name" />
                  </Form.Field>
                  <Form.Field>
                    <label>Middle Name</label>
                    <input placeholder="Middle Name" />
                  </Form.Field>
                  <Form.Field>
                    <label>Last Name</label>
                    <input placeholder="Last Name" />
                  </Form.Field>
                </Grid.Column>
              </Grid>
              <br/>
              <h4>General Information</h4>
              <hr/>
              <Form.Group widths={3}>
                <Form.Input label="Emai" placeholder="promize@we-inc.com" />
                <Form.Input label="Password" placeholder="password" type="password" />
                <Form.Input label="Password confirmation" placeholder="password" type="password" />
              </Form.Group>
              <Form.Group widths={3}>
                <Form.Select label="Gender" options={genderOptions} placeholder="Gender" />
                <Form.Input label="Phone" placeholder="Phone" />
              </Form.Group>
              <h4>Address</h4>
              <hr/>
              <Form.Group widths={4}>
                <Form.Input label="Address" placeholder="Address" />
                <Form.Input label="City" placeholder="City" />
                <Form.Input label="Country" placeholder="Country" />
                <Form.Input label="Zip" placeholder="Zip" />
              </Form.Group>
              <br/>
              <Form.Checkbox label="I agree to the Terms and Conditions" />
              <Button type="submit">Submit</Button>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}
