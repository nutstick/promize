import { InMemoryCache } from 'apollo-cache-inmemory';
import * as TRADEROOMMODALQUERY from './TradeRoomModalQuery.gql';

export interface TradeRoomModalQuery {
  tradeRoomModal: {
    id: string,
    show: boolean,
    __typename?: string,
  };
}

export const state = {
  Query: {
    tradeRoomModal: () => ({
      id: null,
      show: false,
      __typename: 'TradeRoomModal',
    }),
  },
  Mutation: {
    setTradeRoomModal(_, variables, { cache }: { cache: InMemoryCache }) {
      const { show, id } = variables;

      if (id) {
        cache.writeQuery({
          query: TRADEROOMMODALQUERY,
          variables,
          data: {
            tradeRoomModal: {
              id,
              show: true,
              __typename: 'TradeRoomModal',
            },
          },
        });
      } else {
        const { tradeRoomModal } = cache.readQuery<TradeRoomModalQuery>({ query: TRADEROOMMODALQUERY });

        cache.writeQuery({
          query: TRADEROOMMODALQUERY,
          variables,
          data: {
            tradeRoomModal: {
              id: tradeRoomModal.id,
              show,
              __typename: 'TradeRoomModal',
            },
          },
        });
      }

      return null;
    },
  },
};
