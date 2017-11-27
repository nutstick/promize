import { ApolloClient } from 'apollo-client';
import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { QueryProps } from 'react-apollo';
import { ChildProps } from 'react-apollo/types';
import { Link } from 'react-router-dom';
import { Image, Loader } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { ICommandContent, IMessage, IPictureContent, ITextContent } from '../../schema/types/Traderoom/index';
import { IUser } from '../../schema/types/User/index';
import * as ADDMESSAGEMUTATION from './AddMessageMutation.gql';
import * as s from './MessagesLayout.css';
import * as MESSAGESQUERY from './MessagesQuery.gql';
import * as MESSAGESSUBSCRIPTION from './MessagesSubscription.gql';
import * as TRADEROOMSQUERY from './TradeRoomsQuery.gql';

namespace MessagesLayout {
  type TradeRoomsQueryProps<P, R> = P & {
    traderooms?: QueryProps & Partial<R>;
  };

  export interface TradeRoomsQuery {
    me: IUser;
  }

  export type WithTradeRoomsQuery = TradeRoomsQueryProps<{}, TradeRoomsQuery>;

  type MessagesQueryProps<P, R> = P & {
    messages?: QueryProps & Partial<R>;
  };

  export type WithMessagesQuery = MessagesQueryProps<WithTradeRoomsQuery, TradeRoomsQuery>;

  export type Props = ChildProps<WithMessagesQuery, {}>;

  export interface State {
    activeTradeRoom: string;
    messages?: IMessage[];
  }
}

@withStyles(s)
@graphql<{}, MessagesLayout.TradeRoomsQuery>(TRADEROOMSQUERY, {
  name: 'traderooms',
})
@graphql<MessagesLayout.WithTradeRoomsQuery, {}>(ADDMESSAGEMUTATION)
export class MessagesLayout extends React.Component<MessagesLayout.Props, MessagesLayout.State> {
  static contextTypes = {
    client: PropTypes.object,
  };

  private unsubscribe: any;

  constructor(props) {
    super(props);

    this.state = {
      activeTradeRoom: null,
    };
  }

  private onTradeRoomClick(traderoom) {
    this.unsubscribe();

    this.setState({
      activeTradeRoom: traderoom,
    });

    this.context.client.query({
      query: MESSAGESQUERY,
      variables: {
        id: traderoom,
      },
    }).then((results: any) => {
      this.setState({
        messages: results.me.traderoom.messages,
      });

      this.unsubscribe = this.context.client.subscribe({
        query: MESSAGESSUBSCRIPTION,
        variables: {
          id: this.state.activeTradeRoom,
        },
      }).subscribe({
        next({ data }) {
          if (this.state.messages.find((message) => message._id === data._id)) {
            this.setState({
              messages: this.state.messages.concat([data]),
            });
          }
        },
      }).unsubscribe;
    });
  }

  public render() {
    console.log(this.context.client.subscribe);
    const { loading: traderoomsLoading, error: traderoomsError, me } = this.props.traderooms;
    return (
      <div className={s.root}>
        <div className={s.tradeRoomsWrapper}>
          {
            !traderoomsLoading && !traderoomsError && me ? me.traderooms.length ?
            me.traderooms.map((traderoom) => (
              <a href="#" onClick={this.onTradeRoomClick.bind(this, traderoom._id)}>
                <Image avatar src={traderoom.participants[0].avatar} />
              </a>
            )) : <div></div> : <div><Loader active /></div>
          }
        </div>
        <div className={s.messagesWrapper}>
        {
          this.state.activeTradeRoom && !this.props.messages.loading && this.props.messages.error ?
            this.props.messages.me.traderoom.messages.map((message) => (
              <div className={cx(s.message, { [s.own]: message.owner._id === me._id })}>
                {(message.content as ITextContent).text || ((message.content as IPictureContent).pictureUrl && (
                  <Image src={(message.content as IPictureContent).pictureUrl}></Image>
                )) || ((message.content as ICommandContent).command && (
                  <div>
                    {(message.content as ICommandContent).command}
                    {(message.content as ICommandContent).arguments.join(' ')}
                  </div>
                ))}
              </div>
            ),
          ) : this.state.activeTradeRoom ? <div><Loader active /></div> :
          <div>
            Select Trade Room
          </div>
        }
        </div>
      </div>
    );
  }
}
