import { Core, Model } from 'iridium';
import { mongodb } from '../../config';
import { IMessageDocument, Message } from './Message';
import { IProductDocument, Product } from './Product';
import { IReceiptDocument, Receipt } from './Receipt';
import { ITraderoomDocument, Traderoom } from './Traderoom';
import { IUserDocument, User } from './User';

class Database extends Core {
  User = new Model<IUserDocument, User>(this, User);
  Product = new Model<IProductDocument, Product>(this, Product);
  Traderoom = new Model<ITraderoomDocument, Traderoom>(this, Traderoom);
  Receipt = new Model<IReceiptDocument, Receipt>(this, Receipt);
  Message = new Model<IMessageDocument, Message>(this, Message);
}

const database = new Database({ ...mongodb });

export { database, Database };
