import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { DropdownItemProps, Select } from 'semantic-ui-react';
import * as s from './ItemSelector.css';

export namespace ItemSelector {
  export interface IProps {
    onChange?: (e, value?) => void;
    options?: DropdownItemProps[];
    selected?: string;
  }
  export type Props = IProps;
}

@withStyles(s)
export class ItemSelector extends React.Component<ItemSelector.Props> {
  constructor(props) {
    super(props);
  }
  public render() {
    return this.props.options.map((option) => option.text).join().length < 10 ? (
      <div className={cx('ui', 'buttons', 'tiny', 'base', 'basic', s.root)}>
        {this.props.options.map((option) => this.props.selected === option.value ? (
          <div className={cx('ui', 'button', 'active')}
            key={option.value}>
            {option.text}
          </div>
        ) : (
            <div
              className="ui button"
              key={option.value}
              onClick={(e) => {
                if (this.props.onChange) {
                  this.props.onChange(e, option.value);
                }
              }}>
              {option.text}
            </div>
          ))}
      </div>
    ) :
      // TODO:
      <Select
        placeholder="Select your options"
        options={this.props.options}
        onChange={(e, data) => {
          if (this.props.onChange) {
            this.props.onChange(e, data.value);
          }
        }} />;
  }
}
