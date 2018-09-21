import { Query } from 'react-apollo';
import { IUser } from 'schema/types/User';

export namespace MeQuery {
  export interface Data {
    me?: IUser;
  }
}

export class MeQuery extends Query<MeQuery.Data> {}
