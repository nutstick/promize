import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { sizeMe } from 'react-sizeme';
import { arrayMove } from 'react-sortable-hoc';
import { Button, Form, Message } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { IUser } from '../../../schema/types/User';
import * as s from './CreateProduct.css';
import * as CREATEPRODUCTMUTATION from './CreateProductMutation.gql';
import { SortableList } from './SortableList';

namespace CreateProduct {
  export type IProps = { user: IUser } & RouteComponentProps<{ id: string }>;

  export type WithCreateProductMutation = ChildProps<IProps, {}>;
  export type Props = WithCreateProductMutation;

  export interface State {
    name?: string;
    nameError: boolean;
    promotionStartDate?: Date;
    promotionStartDateError: boolean;
    promotionStartTime?: Date;
    promotionStartTimeError: boolean;
    promotionEndDate?: Date;
    promotionEndDateError: boolean;
    promotionEndTime?: Date;
    promotionEndTimeError: boolean;
    description?: string;
    hashtags: string[];
    size: string;
    sizes: string[];
    color: string;
    colors: string[];
    originalPrice?: number;
    price?: number;
    pictures?: FileList;
    error?: any;
  }
}

@withStyles(s)
@sizeMe()
@graphql<CreateProduct.IProps, {}>(CREATEPRODUCTMUTATION)
export class CreateProduct extends React.Component<CreateProduct.Props, CreateProduct.State> {
  constructor(props) {
    super(props);

    this.state = {
      nameError: false,
      promotionStartDateError: false,
      promotionStartTimeError: false,
      promotionEndDateError: false,
      promotionEndTimeError: false,
      hashtags: [],
      color: '',
      colors: [],
      size: '',
      sizes: [],
      error: null,
    };
  }

  public componentDidMount() {
    document.title = 'Create New Product';
  }

  private onInputChange(field, required, e) {
    const value = e.target.value;
    if (value) {
      if (field === 'hashtags') {
        this.setState({
          ...this.state,
          [field]: value.split(',').map((hashtag) => hashtag.trim()),
        });
      } else {
        this.setState({
          ...this.state,
          [field]: value,
          ...required && {
            [`${field}Error`]: false,
          },
        });
      }
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

  private onAddOption(field, to) {
    if (this.state[field].trim().length) {
      this.setState({
        [field]: '',
        [to]: this.state[to].concat([this.state[field].trim()]),
      });
    }
  }

  private onSortEnd(field, { oldIndex, newIndex }) {
    this.setState({
      [field]: arrayMove(this.state[field], oldIndex, newIndex),
    });
  }

  private onRemoveOption(field, value) {
    this.setState({
      [field]: this.state[field].filter((_, index) => index !== value),
    });
  }

  private getAsDate(date, time) {
    try {
      let hours = Number(time.match(/^(\d+)/)[1]);
      const minutes = Number(time.match(/:(\d+)/)[1]);
      const AMPM = time.match(/\s(.*)$/)[1];
      if (AMPM === 'pm' && hours < 12) {
        hours = hours + 12;
      }
      if (AMPM === 'am' && hours === 12) {
        hours = hours - 12;
      }
      let sHours = hours.toString();
      let sMinutes = minutes.toString();
      if (hours < 10) {
        sHours = '0' + sHours;
      }
      if (minutes < 10) {
        sMinutes = '0' + sMinutes;
      }
      time = sHours + ':' + sMinutes + ':00';
      const d = new Date(date);
      const n = d.toISOString().substring(0, 10);
      return new Date(n + 'T' + time);
    } catch (err) {
      return new Date(`${date} ${time}`);
    }
  }

  private onSubmit() {
    this.props.mutate({
      variables: {
        input: {
          name: this.state.name,
          description: this.state.description,
          originalPrice: this.state.originalPrice,
          type: this.state.price ? 'BuyNowProduct' : 'Product',
          price: this.state.price,
          pictures: this.state.pictures,
          hashtags: this.state.hashtags,
          colors: this.state.colors,
          sizes: this.state.sizes,
          categories: null,
          promotionStart: this.getAsDate(this.state.promotionStartDate, this.state.promotionStartTime),
          promotionEnd: this.getAsDate(this.state.promotionEndDate, this.state.promotionEndTime),
       },
      },
      refetchQueries: ['ProductsQuery'],
    })
      .then((data) => {
        this.props.history.push(`/users/${this.props.match.params.id}/products`);
      })
      .catch((error) => {
        this.setState({
          nameError: false,
          promotionStartDateError: false,
          promotionStartTimeError: false,
          promotionEndDateError: false,
          promotionEndTimeError: false,
          hashtags: [],
          color: '',
          colors: [],
          size: '',
          sizes: [],
          error,
        });
      });
  }

  public render() {
    return (
      <div className={s.root}>
        <h1>New Product</h1>
        <Message
          error
          header="There was some errors with your submission"
          list={this.state.error}
        />
        <Form onSubmit={this.onSubmit.bind(this)}>
          <div className={s.imageWrapper}>
            <Form.Field>
              <label>Pictures</label>
              <input
                type="file"
                multiple
                required
                accept="image/*"
                onChange={({ target }) =>
                target.validity.valid && this.setState({
                  pictures: target.files,
                })}
              />
            </Form.Field>
          </div>
          <div className={s.contentWrapper}>
            <Form.Input
              label="Name"
              placeholder="Product Name"
              error={this.state.nameError}
              value={this.state.name}
              onChange={this.onInputChange.bind(this, 'name', true)} />
            <Form.TextArea
              label="Description"
              placeholder="Product Description"
              value={this.state.description}
              onChange={this.onInputChange.bind(this, 'description', false)} />
            {/* FIXME: better hashtags input */}
            <Form.Input
              label="Hashtags"
              placeholder="Hashtags"
              // value={this.state.hashtags}
              onChange={this.onInputChange.bind(this, 'hashtags', false)} />
            <div>
              <Form.Field>
                <label>Sizes</label>
                <Form.Input
                  placeholder="New Size"
                  action>
                  <input
                    onChange={this.onInputChange.bind(this, 'size', false)}
                    value={this.state.size} />
                  <Button onClick={(e) => {
                    this.onAddOption('size', 'sizes');
                    e.preventDefault();
                  }}>Add</Button>
                </Form.Input>
                {this.state.sizes.length ?
                  <SortableList
                    items={this.state.sizes}
                    onRemove={this.onRemoveOption.bind(this, 'sizes')}
                    onSortEnd={this.onSortEnd.bind(this, 'sizes')}
                    distance={5}
                    lockAxis="y" /> : <div className={s.empty}>Empty list of sizes</div>
                }
              </Form.Field>
            </div>
            <br/>
            <div key="colors">
              <Form.Field>
                <label>Color</label>
                <Form.Input
                  placeholder="New Color"
                  action>
                  <input
                    onChange={this.onInputChange.bind(this, 'color', false)}
                    value={this.state.color} />
                  <Button onClick={(e) => {
                    this.onAddOption('color', 'colors');
                    e.preventDefault();
                  }}>Add</Button>
                </Form.Input>
                {this.state.colors.length ?
                  <SortableList
                    items={this.state.colors}
                    onRemove={this.onRemoveOption.bind(this, 'colors')}
                    onSortEnd={this.onSortEnd.bind(this, 'colors')}
                    distance={5}
                    lockAxis="y" /> : <div className={s.empty}>Empty list of colors</div>
                }
              </Form.Field>
            </div>
            <br/>

            <Form.Group inline>
              <Form.Input
                label="Promotion Start"
                placeholder="Date"
                type="date"
                error={this.state.promotionStartDateError}
                value={this.state.promotionStartDate}
                onChange={this.onInputChange.bind(this, 'promotionStartDate', true)} />
              <Form.Input
                placeholder="Time"
                type="time"
                error={this.state.promotionStartTimeError}
                onChange={this.onInputChange.bind(this, 'promotionStartTime', true)} />
            </Form.Group>

            <Form.Group inline>
              <Form.Input
                label="Promotion End"
                placeholder="Date"
                type="date"
                error={this.state.promotionEndDateError}
                value={this.state.promotionEndDate}
                onChange={this.onInputChange.bind(this, 'promotionEndDate', true)} />
              <Form.Input
                placeholder="Time"
                type="time"
                error={this.state.promotionEndTimeError}
                value={this.state.promotionEndTime}
                onChange={this.onInputChange.bind(this, 'promotionEndTime', true)} />
            </Form.Group>

            <Form.Group inline>
              <Form.Input
                label="Pricing"
                placeholder="Orignal Price"
                type="number"
                value={this.state.originalPrice}
                onChange={this.onInputChange.bind(this, 'originalPrice', true)} />
              <Form.Input
                placeholder="Price"
                type="number"
                value={this.state.price}
                onChange={this.onInputChange.bind(this, 'price', true)} />
            </Form.Group>
          </div>
          <Form.Button type="submit">Create</Form.Button>
        </Form>
      </div>
    );
  }
}
