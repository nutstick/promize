import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Menu } from 'semantic-ui-react';

import * as s from './Footer.css';
namespace Footer {
  export type Props = any;
}

@withStyles(s)
export class Footer extends React.Component<Footer.Props> {
  public render() {
    return (
      <div className={s.root}>
        © 2017 Promize  |  This project is maintained by @mms-bunnoi
      </div>
    );
  }
}
