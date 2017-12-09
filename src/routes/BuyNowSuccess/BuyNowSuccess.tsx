import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Card } from '../../components/Card';
import * as s from './BuyNowSuccess.css';

namespace BuyNowSuccess {
  export type Props = any;
}

@withStyles(s)
export class BuyNowSuccess extends React.Component<BuyNowSuccess.Props> {
  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    document.title = 'Success';
  }

  public render() {
    return (
      <div className={s.root}>
        <Card>
          <div className={s.container}>
            <h3>Success create order!!</h3>
          </div>
        </Card>
      </div>
    );
  }
}
