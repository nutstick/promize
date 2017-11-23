import { Model, toObjectID } from 'iridium';
import * as MockDate from 'mockdate';
import { IProductDocument, Product } from '../';
import { Database } from '../../';
import { mongodb } from '../../../../config';
import { IUserDocument, User } from '../../User';

// tslint:disable-next-line:no-var-requires
const m = require('casual');

const database = new Database({
  ...mongodb,
  database: 'test',
});

// const model = new Model<IProductDocument, Product>(database, Product);
// const userModel = new Model<IUserDocument, User>(database, User);

// Pass generator as callback
const array_of = (times, generator) => {
  return Array.apply(null, Array(times)).map(() => generator());
};

const start_date = m.moment;
const end_date = start_date.add(Math.floor(Math.floor(Math.random() * 60)), 'days');

beforeAll(async (done) => {
  await database.connect();
  await database.connection.dropDatabase();

  // Fixed new Date
  MockDate.set('7/9/2017');

  done();
});

afterAll(async (done) => {
  await database.close();

  // Reset mock date
  MockDate.reset();

  done();
});

describe('Product Model', () => {
  it('Product create correctly', async () => {
    const user = await database.User.create({
      first_name: m.first_name,
      last_name: m.last_name,
      tel_number: m.phone,
      account: {
        email: m.email,
        password: m.password,
      },
      avatar: m.url,
    });

    await database.Product.create({
      name: 'Zara',
      description: 'Zara clothes',
      original_price: 1000,
      type: 'BuyNowProduct',
      price: 800,
      pictures: [
        'https://th-live-02.slatic.net/p/7/hequ-1483111676-123106' +
        '5-c566b543a82cfe5a0e279dbf161bd13e-catalog_233.jpg',
      ],
      hashtags: ['uniqlo', 'HandM', 'AIIZ', 'GAP', 'Crocs', 'anello', 'kanken'],
      colors: [{
        color: 'red',
      }, {
        color: 'blue',
      }],
      sizes: [
        { size: 'S' },
        { size: 'M' },
        { size: 'L' },
        { size: 'XL' },
        { size: 'XXL' },
      ],
      promotion_start: new Date(2017, 13, 1, 12),
      promotion_end: new Date(2017, 14, 1, 19),
      owner: user._id,
    });

    // Should be able to find a product that has been created.
    const product = await database.Product.findOne({ name: 'Zara' });
    // TODO: expect all fields
    // expect(deepRemoveFields(product.toJSON(), ['_id'])).toMatchSnapshot();
  });
});
