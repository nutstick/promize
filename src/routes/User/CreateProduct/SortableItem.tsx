import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { Icon } from 'semantic-ui-react';
import * as s from './SortableItem.css';

const DragHandle = SortableHandle(() => <Icon name="bars" />);

export const SortableItem = withStyles(s)(SortableElement(({ value, sortIndex, onRemove }) =>
  <li className={s.item}>
    <div>
      <DragHandle />{value}
    </div>
    <button onClick={(e) => {
        onRemove(sortIndex);
      }}>
      <Icon className={s.remove} name="close"/>
    </button>
  </li>,
));
