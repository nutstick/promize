import { Core, Model } from 'iridium';
import { mongodb } from '../../config';
import { IProductDocument, Product } from './Product';
import { ITraderoom, Traderoom } from './Traderoom';
import { IUserDocument, User } from './User';

class Database extends Core {
  User = new Model<IUserDocument, User>(this, User);
  Product = new Model<IProductDocument, Product>(this, Product);
  Traderoom = new Model<ITraderoom, Traderoom>(this, Traderoom);
}

const database = new Database({ ...mongodb });

export { database, Database };
