import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Button, DropdownItemProps, Select } from 'semantic-ui-react';
import * as s from './ItemSelector.css';

export namespace ItemSelector {
  export interface IProps {
    onChange?: (e, value?) => void;
    options?: DropdownItemProps[];
  }
  export type Props = IProps;

  export interface State {
    selected?: string;
  }
}

@withStyles(s)
export class ItemSelector extends React.Component<ItemSelector.Props, ItemSelector.State> {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
    };
  }
  public render() {
    return this.props.options.map((option) => option.text).join().length < 10 ? (
      <div className={cx('ui', 'buttons', 'tiny', 'base', 'basic', s.root)}>
        {this.props.options.map((option) => this.state.selected === option.value ? (
          <div className={cx('ui', 'button', 'active')}
            key={option.value}>
            {option.text}
          </div>
        ) : (
          <div
            className="ui button"
            key={option.value}
            onClick={(e) => {
              this.setState(() => ({
                selected: option.value,
              }));
              if (this.props.onChange) {
                this.props.onChange(e, option.value);
              }
            }}>
            {option.text}
          </div>
        ))}
      </div>
    ) :
    <Select
      placeholder="Select your country"
      options={this.props.options} />;
  }
}
