import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';

import * as s from './Footer.css';
namespace Footer {
  export type Props = any;
}

@withStyles(s)
export class Footer extends React.Component<Footer.Props> {
  public render() {
    return (
      <div className={s.root}>
        {/* tslint:disable-next-line:max-line-length */}
        <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        © 2017 Promize  |  This project is maintained by @mms-bunnoi
      </div>
    );
  }
}
