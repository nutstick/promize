import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { Button, Divider, Dropdown, Form } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import * as TOGGLELOGINMODALMUTATION from '../../../apollo/login/ToggleLoginModalMutation.gql';
import { IAddress } from '../../../schema/models/User/address';
import { IUser } from '../../../schema/types/User';
import * as ADDRESSESQUERY from './AddressesQuery.gql';
import * as s from './ShippingStep.css';

export namespace ShippingStep {
  export interface IProps {
    prev: (e) => void;
    next: (e) => void;
    onStateChange?: (field, value) => void;
  }

  export type WithToggleLoginMutation = ChildProps<IProps, {}>;

  export interface UserQuery {
    me: IUser;
  }

  export type Props = ChildProps<WithToggleLoginMutation, UserQuery>;

  export interface State {
    address?: string;
    addressError: boolean;
    city?: string;
    cityError: boolean;
    country?: string;
    countryError: boolean;
    zip?: string;
    zipError: boolean;

    userAddress?: string;
  }
}

export const AddressOption = ({ _id, address, city, country, zip }: IAddress) => (
  <div key={_id}>
    <div>{address}</div>
    <div>{city}, {country} {zip}</div>
  </div>
);

@withStyles(s)
@graphql<ShippingStep.IProps, {}>(TOGGLELOGINMODALMUTATION)
@graphql<ShippingStep.WithToggleLoginMutation, ShippingStep.UserQuery>(ADDRESSESQUERY)
export class ShippingStep extends React.Component<ShippingStep.Props, ShippingStep.State> {
  constructor(props) {
    super(props);

    this.state = {
      addressError: false,
      cityError: false,
      countryError: false,
      zipError: false,
    };
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

    if (this.props.onStateChange) {
      this.props.onStateChange(field, value);
    }
  }

  private next(e) {
    const error: {
      addressError?: boolean;
      cityError?: boolean;
      countryError?: boolean;
      zipError?: boolean;
    } = {};
    if (!this.state.address) {
      error.addressError = true;
    }
    if (!this.state.city) {
      error.cityError = true;
    }
    if (!this.state.country) {
      error.countryError = true;
    }
    if (!this.state.zip) {
      error.zipError = true;
    }

    // If User address is set or all fields is filled call next
    // , else set state of error
    this.state.userAddress || Object.keys(error).length === 0 ?
      this.props.next(e) : this.setState({
        ...this.state,
        ...error,
      });
  }

  public render() {
    const countryOptions = [
      { key: 'US',  text: 'United States', value: 'US' },
      { key: 'TH',  text: 'Thailands', value: 'TH' },
    ];

    const { me, loading, error } = this.props.data;

    if (loading) {
      return 'loading';
    } else if (error) {
      return 'error';
    }

    let userAddresses;
    if (me) {
      const options = me.addresses.map((address) => ({
        key: address._id,
        text: address._id,
        value: address._id,
        content: <AddressOption {...address}/>,
      }));

      userAddresses = (
        <Dropdown
          selection
          fluid
          options={options}
          onChange={this.onInputChange.bind(this, 'userAddress', false)}
          placeholder="Choose an shipping address"
        />
      );
    } else {
      userAddresses = (
        <div>
          Returning customer?
          <a href="#" onClick={(e) => { this.props.mutate({}); }}>
            Login
          </a>
        </div>
      );
    }

    return (
      <div className={s.root}>
        {userAddresses}
        <Divider horizontal>Or</Divider>
        <h4>New Shipping Address</h4>
        <span className={s.remark}>*Indicates a required fields</span>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              label="Address"
              placeholder="Address"
              error={this.state.addressError}
              onChange={this.onInputChange.bind(this, 'address', true)}/>
          </Form.Group>
          <Form.Input
            label="City"
            placeholder="City"
            error={this.state.cityError}
            onChange={this.onInputChange.bind(this, 'city', true)}/>
          <Form.Select
            label="Country"
            options={countryOptions}
            placeholder="Country"
            error={this.state.countryError}
            onChange={this.onInputChange.bind(this, 'country', true)} />
          <Form.Input
            label="Zip code"
            placeholder="Zip code"
            error={this.state.zipError}
            onChange={this.onInputChange.bind(this, 'zip', true)} />
        </Form>
        <div>
          <Button
            className={s.left}
            content="Previous"
            onClick={this.props.prev} />
          <Button
            className={s.right}
            color="orange"
            content="Next"
            onClick={this.next.bind(this)} />
        </div>
      </div>
    );
  }
}
