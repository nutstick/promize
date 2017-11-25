import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Account.css';

namespace Account {
  interface IProps {
    title: string;
  }
  export type Props = IProps;
}
@withStyles(s)
export class Account extends React.Component<Account.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>My Account</h1>
      </div>
    );
  }
}
