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

beforeAll(async () => {
  await core.connect();
  await core.connection.dropDatabase();

  // Fixed new Date
  const FIXED_DATE = new Date('2017-06-13T04:41:20');
  (global as any).Date = jest.fn(() => FIXED_DATE);
});

afterAll(() => core.close());

describe('Product Model', () => {
<<<<<<< HEAD
  it('Product create correctly', async () => {
    const user = await userModel.create({
      _id: '5a10494ee67657f236e6b0a2',
      first_name: m.first_name,
      last_name: m.last_name,
      tel_number: m.phone,
      account: {
          email: m.email,
          password: m.password,
      },
      avatar: m.url,
    });
=======
    it('Product create correctly', async () => {
        const user = await user_model.create({
            first_name: m.first_name,
            last_name: m.last_name,
            tel_number: m.phone,
            account: {
                email: m.email,
                password: m.password,
            },
            avatar: m.url,
        });

        const product = await model.create({
            name: m.word,
            description: m.description,
            type: 'BuyNowProduct',
            // price: m.integer(100, 2000),

            picture: array_of(Math.floor(Math.random() * 3) + 1, () => m.random_element([
                'https://th-live-02.slatic.net/p/7/hequ-1483111676-123106' +
                '5-c566b543a82cfe5a0e279dbf161bd13e-catalog_233.jpg',
            ])),
            hashtag: array_of(Math.floor(Math.random() * 3), () => m.random_element([
                'uniqlo', 'HandM', 'AIIZ', 'GAP', 'Crocs', 'anello', 'kanken',
            ])),
            colors: array_of(Math.floor(Math.random() * 3), () => m.color_name),
            sizes: array_of(Math.floor(Math.random() * 3), () => m.random_element(['S', 'M', 'L', 'XL', 'XXL'])),

            promotion_start: m.moment.toDate(),
            promotion_end: m.moment.add(Math.floor(Math.floor(Math.random() * 60)), 'days').toDate(),
            owner: user._id,
        });
>>>>>>> bca2a439d522af2f8a3462811acaa7e9c2a9575e

    await model.create({
      _id: '585b11e7adb8b5f2d655da01',
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

    // Number of product in database should be 1.
    const count = await model.find().count;
    expect(count).toMatchSnapshot();
    // A product should create in database..
    const products = await model.find().toArray();
    expect(products).toMatchSnapshot();
    // Should be able to find a product that has been created.
    const product = await model.findOne({ name: 'Zara' });
    expect(product).toMatchSnapshot();
  });
});
