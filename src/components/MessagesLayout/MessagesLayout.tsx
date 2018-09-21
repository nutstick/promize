import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ChildProps, MutationFunc, QueryResult } from 'react-apollo';
import { Form, Icon, Image, Loader } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { TradeRoomModalQuery } from '../../apollo/tradeRoomModal';
import * as SETTRADEROOMMODALMUTATION from '../../apollo/tradeRoomModal/SetTradeRoomModal.gql';
import { ICommandContent, IMessage, IPictureContent, ITextContent } from '../../schema/types/TradeRoom';
import * as ADDMESSAGEMUTATION from './AddMessageMutation.gql';
import * as MessageImage from './message.svg';
import * as s from './MessagesLayout.css';
import * as MESSAGESQUERY from './MessagesQuery.gql';
import * as MESSAGESSUBSCRIPTION from './MessagesSubscription.gql';

namespace MessagesLayout {
  type SetTradeRoomModal<P, R> = P & {
    setTradeRoomModal?: MutationFunc<R>;
  };

  export type WithSetTradeRoomModalMutation = SetTradeRoomModal<{}, {}>;

  export type Props = ChildProps<WithSetTradeRoomModalMutation, {}>;

  export interface State {
    messages?: IMessage[];
    inputValue: string;
  }
}

@withStyles(s)
export class MessagesLayout extends React.Component<MessagesLayout.Props, MessagesLayout.State> {
  // static contextTypes = {
  //   client: PropTypes.object,
  // };

  // private unsubscribe: any;

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     messages: [],
  //     inputValue: '',
  //   };
  // }

  // componentWillMount() {
  //   if (this.props.tradeRoomModal.data.tradeRoomModal && this.props.tradeRoomModal.tradeRoomModal.id) {
  //     this.onTradeRoomClick(this.props.tradeRoomModal.data.tradeRoomModal.id);
  //   }
  // }

  // private onTradeRoomClick(traderoom) {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }

  //   this.props.setTradeRoomModal({
  //     variables: {
  //       id: traderoom,
  //       show: true,
  //     },
  //   });

  //   this.context.client.query({
  //     query: MESSAGESQUERY,
  //     variables: {
  //       id: traderoom,
  //     },
  //   }).then((results: any) => {
  //     this.setState({
  //       messages: results.data.me.traderoom.messages,
  //     });

  //     this.unsubscribe = this.context.client.subscribe({
  //       query: MESSAGESSUBSCRIPTION,
  //       variables: {
  //         id: this.props.tradeRoomModal.tradeRoomModal.id,
  //       },
  //     }).subscribe({
  //       next: ({ data: { messageAdded } }) => {
  //         if (messageAdded && !this.state.messages.find((message) => message._id === messageAdded._id)) {
  //           this.setState({
  //             messages: this.state.messages.concat([messageAdded]),
  //           });
  //         }
  //       },
  //     }).unsubscribe;
  //   });
  // }

  public render() {
    return null;
    // const { loading: traderoomsLoading, error: traderoomsError, me } = this.props.traderooms;
    // const { tradeRoomModal } = this.props.tradeRoomModal;

    // return (
    //   <div className={s.root}>
    //     <div className={s.header}>
    //       <div className={s.close}><Icon name="x" /></div>
    //     </div>
    //     <div className={s.tradeRoomsWrapper}>
    //       <div className={s.tradeRooms}>
    //         {
    //           !traderoomsLoading && !traderoomsError && me ? me.traderooms.length ?
    //             me.traderooms.map((traderoom) => (
    //               <a
    //                 key={traderoom._id}
    //                 href="#"
    //                 className={cx(s.tradeRoomIcon, { [s.active]: traderoom._id === tradeRoomModal.id })}
    //                 onClick={this.onTradeRoomClick.bind(this, traderoom._id)}>
    //                 <Image circular src={traderoom.participants.find((user) => user._id !== me._id).avatar} />
    //               </a>
    //             )) : <div></div> : <div><Loader active /></div>
    //         }
    //       </div>
    //     </div>
    //     <div className={s.messagesWrapper}>
    //       {
    //         tradeRoomModal.id ? (
    //           <div style={{ height: '100%', paddingBottom: 65 }}>
    //             <div className={s.messages}>
    //               <div>
    //                 {this.state.messages && me ? this.state.messages.map((message) => (
    //                   <div key={message._id} className={cx(s.message, { [s.own]: message.owner._id === me._id })}>
    //                     {(message.content as ITextContent).text || ((message.content as IPictureContent).pictureUrl && (
    //                       <Image src={(message.content as IPictureContent).pictureUrl}></Image>
    //                     )) || ((message.content as ICommandContent).command && (
    //                       <div>
    //                         {(message.content as ICommandContent).command}
    //                         {(message.content as ICommandContent).arguments.join(' ')}
    //                       </div>
    //                     ))}
    //                   </div>
    //                 )) : <div><Loader active /></div>}
    //               </div>
    //             </div>
    //             <Form className={s.inputWrapper} onSubmit={() => {
    //               this.props.mutate({
    //                 variables: {
    //                   traderoom: tradeRoomModal.id,
    //                   content: {
    //                     text: this.state.inputValue,
    //                   },
    //                 },
    //                 optimisticResponse: {
    //                   addMessage: {
    //                     _id: '-1',
    //                     owner: this.props.traderooms.me,
    //                     content: {
    //                       text: this.state.inputValue,
    //                       __typename: 'TextContent',
    //                     },
    //                     createAt: new Date(),
    //                     // TODO: Complete flags
    //                     // completed: false,
    //                     __typename: 'Message',
    //                   },
    //                 },
    //               });
    //               // Clear messages input
    //               this.setState({
    //                 inputValue: '',
    //               });
    //             }}>
    //               {/* <div>
    //               <Icon name="picture"/>
    //               <Icon name="computer"/>
    //             </div> */}
    //               <Form.Input
    //                 className={s.textInput}
    //                 action={{ icon: 'send' }}
    //                 placeholder="Type message..."
    //                 value={this.state.inputValue}
    //                 onChange={(e, { value }) => {
    //                   this.setState({
    //                     inputValue: value,
    //                   });
    //                 }}
    //               />
    //             </Form>
    //           </div>
    //         ) :
    //           <div className={s.select}>
    //             <img src={MessageImage} alt="Select trade room" />
    //             <span className={s.text}>
    //               Please select Trade Room
    //           from above.
    //         </span>
    //           </div>
    //       }
    //     </div>
    //   </div>
    // );
  }
}
