import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Card } from '../../components/Card';
import * as s from './Register.css';

namespace Register {
  export type Props = any;
}

@withStyles(s)
export class Register extends React.Component<Register.Props> {
  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    document.title = 'Register';
  }

  public render() {
    return (
      <div className={s.root}>
        <Card>
        </Card>
      </div>
    );
  }
}
