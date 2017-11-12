interface IMessage {
    owner: string;
    create_at: Date;
    content: ITextMessage | IPictureMessage | ICommandMessage;
}

interface ITextMessage {
    text: string;
}

interface IPictureMessage {
    picture_url: string;
    size: number;
}

interface ICommandMessage {
    command: string;
    arguments: string[];
}

class Message implements IMessage {
    owner: string;
    create_at: Date;
    content: ITextMessage | IPictureMessage | ICommandMessage;
}

export { IMessage, Message };
