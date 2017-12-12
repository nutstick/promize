import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import * as MdLocalOfferIcon from 'react-icons/lib/md/local-offer';
import { RouteComponentProps } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { contentClass, headingClass } from '../../../components/Card';
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
      fetchPolicy: 'network-only',
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
        <div className={headingClass}>
          <MdLocalOfferIcon size={25} style={{
            marginRight: 2.5,
          }} color="#ff9521" />
          <span>Order Receipts</span>
        </div>
        {
          this.props.data.loading || this.props.data.error ? (
            <div className={contentClass}>
              <Loader active />
            </div>
          ) : this.props.data.me.orderReceipts.edges.length === 0 ? (
            <div className={cx(contentClass, s.empty)}>
              No order receipts found.
            </div>
          ) : (
            <div className={contentClass}>
              {this.props.data.me.orderReceipts.edges.map(({ node }) => (
                <div key={node._id} className={s.modal}>
                  <div className={s.pictureWrapper}>
                    <img className={s.picture} src={node.product.pictures[0]} />
                  </div>
                  <div className={s.contentWrapper}>
                    <div className={s.contentHeader}>
                      <div className={s.wrapContainer}>
                        <div className={s.topContent}>
                          <h6 className={s.receiptId}>ORDER ID : {node._id}</h6>
                        </div>
                        <div className={s.downContent}>
                          <h3 className={s.productName}>{node.product.name}</h3>
                        </div>
                      </div>
                      <h6 className={s.productOwner}>{this.name(node.product.owner)}</h6>
                    </div>
                    <div className={s.contentDetail}>
                      <div className={s.leftContent}>
                        <div className={s.titleValueGroup}>
                          <div className={s.title}>SIZE</div>
                          <div className={s.value}>{node.size.size}</div>
                          <div className={s.title}>COLOR</div>
                          <div className={s.value}>{node.color.color}</div>
                        </div>
                        <div>
                          <div className={s.shipTo}>
                            SHIPPING INFORMATION
                      </div>
                          <div className={s.shippingInfo}>
                            <span>{node.deliverAddress.address}</span>
                            <span>{node.deliverAddress.city}</span>
                            <span>{node.deliverAddress.country}</span>
                            <span>{node.deliverAddress.zip}</span>
                          </div>
                        </div>
                        <div className={s.titleValueGroup}>
                          <div className={s.title}>TRACKING NUMBER</div>
                          <div className={s.value}>{node.trackingId}</div>
                        </div>
                        <div className={s.titleValueGroup}>
                          <div className={s.title}>REMARK</div>
                          <div className={s.value}>{node.remark}</div>
                        </div>
                      </div>

                      <div className={s.rightContent}>
                        <div className={s.contentFooter}>
                          <div className={s.titleValueGroup}>
                            <div className={s.title}>PRODUCT DELIVERED</div>
                            <div className={s.value}>{node.productDelivered}</div>
                            <div className={s.title}>AT</div>
                            <div className={s.value}>{node.productDeliveredAt}</div>
                          </div>

                          <div className={s.titleValueGroup}>
                            <div className={s.title}>PAYMEMT COMPLETED</div>
                            <div className={s.value}>{node.paymentCompleted}</div>
                            <div className={s.title}>AT</div>
                            <div className={s.value}>{node.paymentCompletedAt}</div>
                          </div>

                          <div className={s.titleValueGroup}>
                            <div className={s.title}>PRODUCT RECEIVED</div>
                            <div className={s.value}>{node.productReceived}</div>
                            <div className={s.title}>AT</div>
                            <div className={s.value}>{node.productReceivedAt}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={s.buttonWrap}>
                      <a onClick={(e) => this.props.mutate({
                        variables: {
                          id: node._id,
                          input: {
                            status: 'RECEIVED',
                          },
                        },
                      })}>
                        <Button className="s.button" color="orange">
                          <Button.Content>Confirm Received</Button.Content>
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    );
  }
}
