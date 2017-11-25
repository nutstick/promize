import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './BecomeCoSeller.css';

namespace BecomeCoSeller {
  interface IProps {
    title: string;
  }
  export type Props = IProps;
}
@withStyles(s)
export class BecomeCoSeller extends React.Component<BecomeCoSeller.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>Co-Seller</h1>
      </div>
    );
  }
}
