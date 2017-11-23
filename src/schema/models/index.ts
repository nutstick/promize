import { Core, Model } from 'iridium';
import { mongodb } from '../../config';
import { IProductDocument, Product } from './Product';
import { IReceiptDocument, Receipt } from './Receipt';
import { ITraderoom, Traderoom } from './Traderoom';
import { IUserDocument, User } from './User';

class Database extends Core {
  User = new Model<IUserDocument, User>(this, User);
  Product = new Model<IProductDocument, Product>(this, Product);
  Traderoom = new Model<ITraderoom, Traderoom>(this, Traderoom);
  Receipt = new Model<IReceiptDocument, Receipt>(this, Receipt);
}

const database = new Database({ ...mongodb });

export { database, Database };
