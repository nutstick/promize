import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './OrderReceipts.css';

namespace OrderReceipts {
  interface IProps {
    title: string;
  }
  export type Props = IProps;
}
@withStyles(s)
export class OrderReceipts extends React.Component<OrderReceipts.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>Order Receipts</h1>
      </div>
    );
  }
}
