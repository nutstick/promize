import { Query } from 'react-apollo';
import { IUser } from 'schema/types/User';

export namespace TradeRoomsQuery {
  export interface Data {
    me?: IUser;
  }
}

export class TradeRoomsQuery extends Query<TradeRoomsQuery.Data> {}
