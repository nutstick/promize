import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { graphql } from '../../../apollo/graphql';
import { CoSellerRegisterStatus } from '../../../schema/types/User';
import * as s from './BecomeCoSeller.css';
import * as COSELLERREGISTERMUTATION from './CoSellerRegisterMutation.gql';
import * as COSELLERREGISTERSTATUSQUERY from './CoSellerRegisterStatusQuery.gql';

namespace BecomeCoSeller {
  export type IProps = RouteComponentProps<{ id: string }>;

  export type WithCoSellerRegisterMutation = ChildProps<IProps, {}>;

  export interface CoSellerRegisterStatusQuery {
    me: {
      coSellerRegisterStatus: CoSellerRegisterStatus,
    };
  }

  export type WithCoSellerRegisterStatus = ChildProps<IProps, CoSellerRegisterStatusQuery>;

  export type Props = WithCoSellerRegisterStatus;
}

@withStyles(s)
@graphql<BecomeCoSeller.IProps, {}>(COSELLERREGISTERMUTATION)
@graphql<BecomeCoSeller.WithCoSellerRegisterMutation, BecomeCoSeller.CoSellerRegisterStatusQuery>(
  COSELLERREGISTERSTATUSQUERY,
)
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
