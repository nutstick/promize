import { Query } from 'react-apollo';

export namespace TradeRoomsQuery {
  export interface Data {
    tradeRoomModal?: {
      id: string;
      show: boolean;
    };
  }
}

export class TradeRoomsQuery extends Query<TradeRoomsQuery.Data> {}
