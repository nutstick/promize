import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Products.css';

namespace Products {
  interface IProps {
    title: string;
  }
  export type Props = IProps;
}
@withStyles(s)
export class Products extends React.Component<Products.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>My Products</h1>
      </div>
    );
  }
}
