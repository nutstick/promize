import { graphql } from 'graphql';
import { Schema } from '../../../';
import { mongodb } from '../../../../config';
import { Database } from '../../../models';
import resolver from '../resolver';
// tslint:disable-next-line:no-var-requires
const m = require('casual');
const database = new Database({
  ...mongodb,
  database: 'test',

});

beforeAll(async () => {
  await database.connect();
  await database.connection.dropDatabase();
  // Init test database
  const user = await database.User.create({
    first_name: 'Ammarin',
    last_name: 'Jetthakun',
    tel_number: '0123456789',
    account: {
      email: 'ammarinjtk@gmail.com',
      password: 'donttell',
    },
    avatar: 'someurl',
  });
  await database.Product.create({
    name: 'Zara',
    description: 'Zara clothes',
    original_price: 1000,
    type: 'BuyNowProduct',
    price: 800,
    picture: ['https://th-live-02.slatic.net/p/7/hequ-1483111676-123106' +
      '5-c566b543a82cfe5a0e279dbf161bd13e-catalog_233.jpg'],
    hashtag: ['uniqlo'],
    colors: ['red'],
    sizes: ['S'],
    promotion_start: m.moment.toDate(),
    promotion_end: m.moment.toDate(),
    owner: user._id,
    createAt: m.moment.toDate(),
    updateAt: m.moment.toDate(),
  });
});

afterAll(() => database.close());

it('Mutation createProduct should insert new product into mongodb', async () => {
  const user = await database.User.findOne({
    first_name: 'Ammarin',
  });
  // console.log(user)
  await resolver.Mutation.createProduct({
    name: 'a',
    original_price: 800,
    colors: ['red'],
    size: ['S'],
    promotion_start: m.moment.toDate(),
    promotion_end: m.moment.toDate(),
    owner: user._id,
  });
  expect(await database.Product.findOne({ name: 'a' }))
    .toEqual(expect.anything());
});
