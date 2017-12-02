import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { IOrderReceipt } from '../../../schema/types/OrderReceipt';
import { IPage } from '../../../schema/types/Pagination';
import * as UPDATEORDERRECEIPTSTATUSMUTATION from '../UpdateOrderReceiptStatusMutation.gql';
import * as s from './BuyOrderReceipts.css';
import * as BUYORDERRECEIPTSQUERY from './BuyOrderReceiptsQuery.gql';

namespace BuyOrderReceipts {
  export type IProps = RouteComponentProps<{ id: string }>;

  export type WithUpdateOrderReceiptStatusMutation = ChildProps<IProps, {}>;

  export interface BuyOrderReceiptsQuery {
    me: {
      buyOrderReceipts: IPage<IOrderReceipt>,
    };
  }

  type WithBuyOrderReceiptsQuery = ChildProps<WithUpdateOrderReceiptStatusMutation, BuyOrderReceiptsQuery>;

  export type Props = WithBuyOrderReceiptsQuery;
}

@withStyles(s)
@graphql<BuyOrderReceipts.IProps, {}>(UPDATEORDERRECEIPTSTATUSMUTATION)
@graphql<BuyOrderReceipts.WithUpdateOrderReceiptStatusMutation, BuyOrderReceipts.BuyOrderReceiptsQuery>(
  BUYORDERRECEIPTSQUERY,
  {
    options: {
      variables(props) {
        return {
          first: 10,
        };
      },
    },
  },
)
export class BuyOrderReceipts extends React.Component<BuyOrderReceipts.Props> {
  constructor(props) {
    super(props);
  }

  private name(user) {
    if (user.middleName) {
      return `${user.firstName} ` +
        `${user.middleName}` +
        `${user.lastName}`;
    }
    return `${user.firstName} ` +
      `${user.lastName}`;
  }

  public render() {
    // TODO: Pagination
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>Order Receipts</h1>
        {
          this.props.data.loading || this.props.data.error ? (
            <div>
              <Loader active />
            </div>
          ) : (
            <div>
            {this.props.data.me.buyOrderReceipts.edges.map(({ node }) => (
              <div key={node._id}>
                {node._id}
                buyer: <div key={node._id}>
                  {this.name(node.creator)}
                </div>
                {node.size}
                {node.color}
                <div>
                  {node.deliverAddress.address}
                  {node.deliverAddress.city}
                  {node.deliverAddress.country}
                  {node.deliverAddress.zip}
                </div>
                {node.trackingId}
                {node.remark}
                {node.productDelivered}
                {node.productDeliveredAt}
                {node.paymentCompleted}
                {node.paymentCompletedAt}
                {node.productReceived}
                {node.productReceivedAt}
                <a onClick={(e) => this.props.mutate({
                  variables: {
                    id: node._id,
                    input: {
                      status: 'DELIVERED',
                    },
                  },
                })}>Update status to Delivered</a>
              </div>
            ))}
          </div>
          )
        }
      </div>
    );
  }
}
