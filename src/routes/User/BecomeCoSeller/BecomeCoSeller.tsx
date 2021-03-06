import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Card, Form, Label } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { CoSellerRegisterStatus } from '../../../schema/types/User';
import * as s from './BecomeCoSeller.css';
import * as COSELLERREGISTERMUTATION from './CoSellerRegisterMutation.gql';
import * as COSELLERREGISTERSTATUSQUERY from './CoSellerRegisterStatusQuery.gql';

namespace BecomeCoSeller {
  export type IProps = RouteComponentProps<{ id: string }>;

  export interface CoSellerRegisterMutation {
    _id: string;
    coSellerRegisterStatus: string;
  }

  export type WithCoSellerRegisterMutation = ChildProps<IProps, {}>;

  export interface CoSellerRegisterStatusQuery {
    me: {
      coSellerRegisterStatus: CoSellerRegisterStatus,
    };
  }

  export type WithCoSellerRegisterStatus = ChildProps<IProps, CoSellerRegisterStatusQuery>;

  export type Props = WithCoSellerRegisterStatus;

  export interface State {
    upload: boolean;
    citizenCardImage?: File;
    telNumber?: string;
    pending: boolean;
  }
}

@withStyles(s)
@graphql<BecomeCoSeller.IProps, BecomeCoSeller.CoSellerRegisterMutation>(COSELLERREGISTERMUTATION)
@graphql<BecomeCoSeller.WithCoSellerRegisterMutation, BecomeCoSeller.CoSellerRegisterStatusQuery>(
  COSELLERREGISTERSTATUSQUERY,
)
export class BecomeCoSeller extends React.Component<BecomeCoSeller.Props, BecomeCoSeller.State> {
  constructor(props) {
    super(props);

    this.state = {
      upload: false,
      pending: false,
    };
  }

  public render() {
    return (
      <div className={s.root}>
        {
          this.state.upload ?
          <Form onSubmit={() => {
            this.props.mutate({
              variables: {
                input: {
                  telNumber: this.state.telNumber,
                  citizenCardImage: this.state.citizenCardImage,
                },
              },
              refetchQueries: ['CoSellerRegisterStatus'],
              // TODO: Use update query
              // updateQueries: {
              //   CoSellerRegisterStatus(previousResult, { mutationResult }) {
              //     return {
              //       ...previousResult,
              //       me: {
              //         ...previousResult.me,
              //         coSellerRegisterStatus: mutationResult.data.coSellerRegisterStatus,
              //       },
              //     },
              //   },
              // },
            });
            this.setState({
              upload: false,
              pending: true,
            });
          }}>
            <Card>
              <Card.Content>
                <Card.Header>
                  CoSeller Register
                </Card.Header>
                <Card.Meta>
                  To be a CoSeller, Image of your citizen card and telephone number is needed.
                </Card.Meta>
                <Card.Description>
                  <Form.Field>
                    <label>Citizen Card</label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={({ target }) =>
                      target.validity.valid && this.setState({
                        citizenCardImage: target.files[0],
                      })}
                    />
                  </Form.Field>
                  <Form.Input
                    labelPosition="right"
                    label="Telephone Number"
                    placeholder="Telephone Number"
                    onChange={(_, { value }) => {
                      this.setState({ telNumber: value });
                    }}>
                    <Label basic>Tel.</Label>
                    <input required />
                  </Form.Input>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Button basic>Submit</Button>
                </div>
              </Card.Content>
            </Card>
          </Form> : <Button
            className={s.button}
            color="orange"
            disabled={this.state.pending}
            onClick={() => this.setState({
              upload: true,
            })}>{this.state.pending ? 'Pending' : 'Become CoSeller'}</Button>
        }

        <h1 className={s.header}>CoSeller</h1>
      </div>
    );
  }
}
