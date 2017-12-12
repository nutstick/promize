import { Collection, Instance, ObjectID, Property, Validate } from 'iridium';

interface ITextMessage {
  text: string;
}

interface IPictureMessage {
  picture_url: string;
  size: number;
}

interface ICommandMessage {
  command: string;
  arguments?: string[];
}

interface IMessageDocument {
    _id?: string;
    traderoom: string;
    content: ITextMessage | IPictureMessage | ICommandMessage;
    owner: string;
    createAt?: Date;
}

@Validate('MessageContentValidator', (_, data, path) => {
  if (!data.text && (!data.picture_url || !data.size) &&
    (!data.command || !data.arguments)) {
    return this.fail('Message.content must be type of Text, Picture, or Command');
  }
})
@Collection('messages')
class Message extends Instance<IMessageDocument, Message> implements IMessageDocument {
    @ObjectID
    _id: string;

    @Property(String, true)
    traderoom: string;

    @Property('MessageContentValidator', true)
    content: ITextMessage | IPictureMessage | ICommandMessage;

    @Property(String, true)
    owner: string;

    @Property(Date, false)
    createAt: Date;

    static onCreating(message: IMessageDocument) {
      message.createAt = new Date();
    }
}

export { IMessageDocument, Message };
