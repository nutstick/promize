import { Query } from 'react-apollo';
import { IUser } from 'schema/types/User';

export namespace MessagesQuery {
  export interface Data {
    me?: IUser;
  }
}

export class MessagesQuery extends Query<MessagesQuery.Data> {}
