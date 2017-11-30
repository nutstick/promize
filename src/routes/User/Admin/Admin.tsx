import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Image, List, Loader } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { graphql } from '../../../apollo/graphql';
import { IOrderReceipt } from '../../../schema/types/OrderReceipt';
import { IPage } from '../../../schema/types/Pagination';
import { ICoSeller } from '../../../schema/types/User/index';
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
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>Pending CoSeller</h1>
        {
          this.props.data.loading || this.props.data.error ? (
            <div>
              <Loader />
            </div>
          ) : (
            <List>
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
