import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Button, Checkbox, Form, Image, Grid } from 'semantic-ui-react'
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
              <Grid>
                <Grid.Column mobile={16} tablet={4} computer={4}>
                  <Image src='https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png' size='small' circular />          
                </Grid.Column>
                <Grid.Column mobile={16} tablet={12} computer={12}>
                  <Form.Field>
                    <label>First Name</label>
                    <input placeholder='First Name' />
                  </Form.Field>
                  <Form.Field>
                    <label>Last Name</label>
                    <input placeholder='Last Name' />
                  </Form.Field>
                </Grid.Column>
              </Grid>
              <br/>
              <Form.Group widths={3}>
                <Form.Select label='Gender' options={genderOptions} placeholder='Gender' />
                <Form.Input label='Address' placeholder='Address' />
                <Form.Input label='Phone' placeholder='Phone' />
              </Form.Group>
              <Form.TextArea label='About' placeholder='Tell us more about you...' />
              <Form.Checkbox label='I agree to the Terms and Conditions' />
              <Button type='submit'>Submit</Button>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}
