import { IUserType } from '../User';
import resolver from './resolver';
import * as type from './typeDef.gql';

export interface ITextContent {
  text: string;
}
export interface IPictureContent {
  pictureUrl: string;
  size: number;
}
export interface ICommandContent {
  command: string;
  arguments: string[];
}

export interface IMassage {
  _id?: string;
  traderoom?: string;
  content?: ITextContent | IPictureContent | ICommandContent;
  owner?: IUserType;
  createAt?: Date;
}

export interface ITradeRoom {
  _id?: string;
  participants?: IUserType[];
  messages?: IMassage[];
}

export {
  resolver,
  type,
};
