import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import * as MdAssignmentInd from 'react-icons/lib/md/assignment-ind';
import { RouteComponentProps } from 'react-router-dom';
import { Image, List, Loader } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { contentClass, headingClass } from '../../../components/Card';
import { IOrderReceipt } from '../../../schema/types/OrderReceipt';
import { IPage } from '../../../schema/types/Pagination';
import { ICoSeller } from '../../../schema/types/User';
import * as s from './Admin.css';
import * as APPROVECOSELLERMUTATION from './ApproveCoSellerMutation.gql';
import * as PENDINGCOSELLERQUERY from './PendingCoSellerQuery.gql';

namespace Admin {
  export type IProps = RouteComponentProps<{ id: string }>;

  export type WithApproveCoSellerMutation = ChildProps<IProps, {}>;

  export interface PendingCoSellerQuery {
    me: {
      pendingCoSellers: ICoSeller[],
    };
  }

  type WithMyAdminQuery = ChildProps<WithApproveCoSellerMutation, PendingCoSellerQuery>;

  export type Props = WithMyAdminQuery;
}
@withStyles(s)
@graphql<Admin.IProps, {}>(APPROVECOSELLERMUTATION)
@graphql<Admin.WithApproveCoSellerMutation, Admin.PendingCoSellerQuery>(PENDINGCOSELLERQUERY)
export class Admin extends React.Component<Admin.Props> {
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
          <MdAssignmentInd size={25} style={{
            marginRight: 2.5,
          }} color="#ff9521" />
          <span>Requested Users</span>
        </div>
        {
          this.props.data.loading || this.props.data.error ? (
            <div className={contentClass}>
              <Loader active />
            </div>
          ) : this.props.data.me.pendingCoSellers.length === 0 ? (
            <div className={cx(contentClass, s.empty)}>
              No pending request user yet.
            </div>
          ) : (
            <List className={contentClass}>
              {this.props.data.me.pendingCoSellers.map(({ avatar, _id, ...node }) => (
                <List.Item key={_id} className={s.modal}>
                  <List.Content floated="right">
                    <Button onClick={() => {
                      this.props.mutate({
                        variables: {
                          id: _id,
                        },
                      });
                    }}>Approve</Button>
                  </List.Content>
                  <Image avatar src={avatar} />
                  <List.Content>
                    {this.name(node)}
                  </List.Content>
                </List.Item>
              ))}
            </List>
          )
        }
      </div>
    );
  }
}
