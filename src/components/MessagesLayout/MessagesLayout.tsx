import { ApolloClient } from 'apollo-client';
import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ChildProps, MutationFunc, QueryProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Button, Form, Icon, Image, Input, Loader } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { TradeRoomModalQuery } from '../../apollo/tradeRoomModal/index';
import * as SETTRADEROOMMODALMUTATION from '../../apollo/tradeRoomModal/SetTradeRoomModal.gql';
import * as TRADEROOMMODALQUERY from '../../apollo/tradeRoomModal/TradeRoomModalQuery.gql';
import { ICommandContent, IMessage, IPictureContent, ITextContent } from '../../schema/types/Traderoom/index';
import { IUser } from '../../schema/types/User/index';
import * as ADDMESSAGEMUTATION from './AddMessageMutation.gql';
import * as s from './MessagesLayout.css';
import * as MESSAGESQUERY from './MessagesQuery.gql';
import * as MESSAGESSUBSCRIPTION from './MessagesSubscription.gql';
import * as TRADEROOMSQUERY from './TradeRoomsQuery.gql';

namespace MessagesLayout {
  type TradeRoomModalProps<P, R> = P & {
    tradeRoomModal?: QueryProps & Partial<R>;
  };

  export type WithTradeRoomModal = TradeRoomModalProps<{}, TradeRoomModalQuery>;

  type TradeRoomsQueryProps<P, R> = P & {
    traderooms?: QueryProps & Partial<R>;
  };

  export interface TradeRoomsQuery {
    me: IUser;
  }

  export type WithTradeRoomsQuery = TradeRoomsQueryProps<WithTradeRoomModal, TradeRoomsQuery>;

  type SetTradeRoomModal<P, R> = P & {
    setTradeRoomModal?: MutationFunc<R>;
  };

  export type WithSetTradeRoomModalMutation = SetTradeRoomModal<WithTradeRoomsQuery, {}>;

  export type Props = ChildProps<WithSetTradeRoomModalMutation, {}>;

  export interface State {
    messages?: IMessage[];
    inputValue: string;
  }
}

@withStyles(s)
@graphql<{}, TradeRoomModalQuery>(TRADEROOMMODALQUERY, {
  name: 'tradeRoomModal',
})
@graphql<MessagesLayout.WithTradeRoomModal, {}>(SETTRADEROOMMODALMUTATION, {
  name: 'setTradeRoomModal',
})
@graphql<MessagesLayout.WithSetTradeRoomModalMutation, MessagesLayout.TradeRoomsQuery>(TRADEROOMSQUERY, {
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
      messages: [],
      inputValue: '',
    };
  }

  componentWillMount() {
    if (this.props.tradeRoomModal.tradeRoomModal && this.props.tradeRoomModal.tradeRoomModal.id) {
      this.onTradeRoomClick(this.props.tradeRoomModal.tradeRoomModal.id);
    }
  }

  private onTradeRoomClick(traderoom) {
    const { state, setState } = this;
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.props.setTradeRoomModal({
      variables: {
        id: traderoom,
        show: true,
      },
    });

    this.context.client.query({
      query: MESSAGESQUERY,
      variables: {
        id: traderoom,
      },
    }).then((results: any) => {
      this.setState({
        messages: results.data.me.traderoom.messages,
      });

      this.unsubscribe = this.context.client.subscribe({
        query: MESSAGESSUBSCRIPTION,
        variables: {
          id: this.props.tradeRoomModal.tradeRoomModal.id,
        },
      }).subscribe({
        next: function({ data: { messageAdded } }) {
          if (messageAdded && !this.state.messages.find((message) => message._id === messageAdded._id)) {
            this.setState({
              messages: this.state.messages.concat([messageAdded]),
            });
          }
        }.bind(this),
      }).unsubscribe;
    });
  }

  public render() {
    console.log(this.state.messages);
    const { loading: traderoomsLoading, error: traderoomsError, me } = this.props.traderooms;
    return (
      <div className={s.root}>
        <div className={s.header}>
          <div className={s.close}><Icon name="x"/></div>
        </div>
        <div className={s.tradeRoomsWrapper}>
          {
            !traderoomsLoading && !traderoomsError && me ? me.traderooms.length ?
            me.traderooms.map((traderoom) => (
              <a key={traderoom._id}
                href="#" className={s.tradeRoomIcon} onClick={this.onTradeRoomClick.bind(this, traderoom._id)}>
                <Image avatar src={traderoom.participants.find((user) => user._id !== me._id).avatar} />
              </a>
            )) : <div></div> : <div><Loader active /></div>
          }
        </div>
        <div className={s.messagesWrapper}>
        {
          this.props.tradeRoomModal.tradeRoomModal.id ? (
            <div style={{ height: '100%', paddingBottom: 65 }}>
              <div className={s.messages}>
                <div>
                  {this.state.messages && me ? this.state.messages.map((message) => (
                    <div key={message._id} className={cx(s.message, { [s.own]: message.owner._id === me._id })}>
                      {(message.content as ITextContent).text || ((message.content as IPictureContent).pictureUrl && (
                        <Image src={(message.content as IPictureContent).pictureUrl}></Image>
                      )) || ((message.content as ICommandContent).command && (
                        <div>
                          {(message.content as ICommandContent).command}
                          {(message.content as ICommandContent).arguments.join(' ')}
                        </div>
                      ))}
                    </div>
                  )) : <div><Loader active /></div>}
                </div>
              </div>
              <Form className={s.inputWrapper} onSubmit={() => {
                this.props.mutate({
                  variables: {
                    traderoom: this.props.tradeRoomModal.tradeRoomModal.id,
                    content: {
                      text: this.state.inputValue,
                    },
                  },
                });
                this.setState({
                  inputValue: '',
                });
              }}>
                {/* <div>
                  <Icon name="picture"/>
                  <Icon name="computer"/>
                </div> */}
                <Form.Input
                  className={s.textInput}
                  action={{ icon: 'send' }}
                  placeholder="Type message..."
                  value={this.state.inputValue}
                  onChange={(e, { value }) => {
                    this.setState({
                      inputValue: value,
                    });
                  }}
                />
              </Form>
            </div>
          ) :
          <div>
            Select Trade Room
          </div>
        }
        </div>
      </div>
    );
  }
}
