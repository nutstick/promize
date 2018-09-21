import * as Iridium from 'iridium';
import { mongodb } from '../../config';
import { IMessageDocument, Message } from './Message';
import { IProductDocument, Product } from './Product';
import { IReceiptDocument, Receipt } from './Receipt';
import { ITraderoomDocument, Traderoom } from './Traderoom';
import { IUserDocument, User } from './User';

class Database extends Iridium.Core {
  User = new Iridium.Model<IUserDocument, User>(this, User);
  Product = new Iridium.Model<IProductDocument, Product>(this, Product);
  Traderoom = new Iridium.Model<ITraderoomDocument, Traderoom>(this, Traderoom);
  Receipt = new Iridium.Model<IReceiptDocument, Receipt>(this, Receipt);
  Message = new Iridium.Model<IMessageDocument, Message>(this, Message);
}

const database = new Database({ ...mongodb });

export { database, Database };
