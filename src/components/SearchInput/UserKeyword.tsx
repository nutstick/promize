import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { Button, Image } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import * as s from './UserKeyword.css';
import * as USERQUERY from './UserQuery.gql';

export namespace UserKeyword {
  export interface IProps {
    id: string;
  }

  export interface UserQuery {
    user: {
      _id: string;
      avatar: string;
      firstName: string;
    };
  }

  export type Props = ChildProps<IProps, UserQuery>;
}

@withStyles(s)
@graphql<UserKeyword.IProps, UserKeyword.UserQuery>(USERQUERY, {
  options({ id }) {
    return {
      variables: {
        id,
      },
    };
  },
})
export class UserKeyword extends React.Component<UserKeyword.Props> {
  public render() {
    return this.props.data.loading ?
      <span className={cx(s.root)}>
        <Image avatar src={null} />
      </span> : this.props.data.error ?
        <span className={cx(s.root)}>
          <Image avatar src={null} />
          <span className={s.text}>{this.props.id}</span>
        </span> :
        <div className={s.root}>
          <Image avatar circular src={this.props.data.user.avatar} />
          <span className={s.text}>{this.props.data.user.firstName}</span>
        </div>;
  }
}
