import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Activities.css';

namespace Activities {
  interface IProps {
    title: string;
  }
  export type Props = IProps;
}
@withStyles(s)
export class Activities extends React.Component<Activities.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>Activities</h1>
      </div>
    );
  }
}
