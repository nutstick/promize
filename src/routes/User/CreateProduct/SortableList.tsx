import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { SortableItem } from './SortableItem';
import * as s from './SortableList.css';

export const SortableList = withStyles(s)(SortableContainer(({ items, onRemove }) => {
  return (
    <ul className={s.list}>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          sortIndex={index}
          value={value}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}));
