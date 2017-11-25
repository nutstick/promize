import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './PaymentMethod.css';

namespace PaymentMethod {
  interface IProps {
    title: string;
  }
  export type Props = IProps;
}
@withStyles(s)
export class PaymentMethod extends React.Component<PaymentMethod.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>Manange Payment Method</h1>
      </div>
    );
  }
}
