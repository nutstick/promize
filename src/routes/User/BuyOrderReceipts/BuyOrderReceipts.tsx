import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './BuyOrderReceipts.css';

namespace BuyOrderReceipts {
  interface IProps {
    title: string;
  }
  export type Props = IProps;
}
@withStyles(s)
export class BuyOrderReceipts extends React.Component<BuyOrderReceipts.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>Buy orders</h1>
      </div>
    );
  }
}
