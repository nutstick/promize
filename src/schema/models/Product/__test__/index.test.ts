import { Core, Model, toObjectID } from 'iridium';
import { IProductDocument, Product } from '../';
import { mongodb } from '../../../../config';
import { IUserDocument, User } from '../../User';

// tslint:disable-next-line:no-var-requires
const m = require('casual');

const core = new Core({
  ...mongodb,
  database: 'test',
});

const model = new Model<IProductDocument, Product>(core, Product);
const userModel = new Model<IUserDocument, User>(core, User);

// Pass generator as callback
const array_of = (times, generator) => {
    return Array.apply(null, Array(times)).map(() => generator());
};

const start_date = m.moment;
const end_date = start_date.add(Math.floor(Math.floor(Math.random() * 60)), 'days');

beforeAll(async (done) => {
  await core.connect();
  await core.connection.dropDatabase();

  // Fixed new Date
  const FIXED_DATE = new Date(Date.UTC(2017, 7, 9, 8));
  (global as any).Date = jest.fn((...input) => FIXED_DATE);

  done();
});

afterAll(() => core.close());

describe('Product Model', () => {
  it('Product create correctly', async () => {
    const user = await userModel.create({
      _id: '5a14551e5c792d26989a2bb6',
      first_name: m.first_name,
      last_name: m.last_name,
      tel_number: m.phone,
      account: {
          email: m.email,
          password: m.password,
      },
      avatar: m.url,
    });

    await model.create({
      _id: '5a14553b1ca61b26cad1b448',
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
      colors: ['red', 'blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      promotion_start: new Date(2017, 13, 1, 12),
      promotion_end: new Date(2017, 14, 1, 19),
      owner: user._id,
    });

    // Should be able to find a product that has been created.
    const product = await model.findOne({ name: 'Zara' });
    expect(product).toMatchSnapshot();
  });
});
