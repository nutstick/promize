import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { IOrderReceipt } from '../../../schema/types/OrderReceipt';
import { IPage } from '../../../schema/types/Pagination';
import * as UPDATEORDERRECEIPTSTATUSMUTATION from '../UpdateOrderReceiptStatusMutation.gql';
import * as MYORDERRECEIPTSQUERY from './MyOrderReceiptsQuery.gql';
import * as s from './OrderReceipts.css';

namespace OrderReceipts {
  export type IProps = RouteComponentProps<{ id: string }>;

  export type WithUpdateOrderReceiptStatusMutation = ChildProps<IProps, {}>;

  export interface MyOrderReceiptsQuery {
    me: {
      orderReceipts: IPage<IOrderReceipt>,
    };
  }

  type WithMyOrderReceiptsQuery = ChildProps<WithUpdateOrderReceiptStatusMutation, MyOrderReceiptsQuery>;

  export type Props = WithMyOrderReceiptsQuery;
}
@withStyles(s)
@graphql<OrderReceipts.IProps, {}>(UPDATEORDERRECEIPTSTATUSMUTATION)
@graphql<OrderReceipts.WithUpdateOrderReceiptStatusMutation, OrderReceipts.MyOrderReceiptsQuery>(
  MYORDERRECEIPTSQUERY,
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
export class OrderReceipts extends React.Component<OrderReceipts.Props> {
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
      <div className={s.root}>
        <h1 className={s.header}>Order Receipts</h1>
        {
          this.props.data.loading || this.props.data.error ? (
            <div>
              <Loader />
            </div>
          ) : (
            <div>
            {this.props.data.me.orderReceipts.edges.map(({ node }) => (
              <div key={node._id}>
                {node._id}
                <div>
                  {node.product.pictures[0]}
                </div>
                <div>
                  {node.product.name}
                  {this.name(node.product.owner)}
                </div>
                {node.size.size}
                {node.color.color}
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
                      status: 'RECEIVED',
                    },
                  },
                })}>Confirm Received</a>
              </div>
            ))}
          </div>
          )
        }
      </div>
    );
  }
}
