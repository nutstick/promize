import { graphql } from 'graphql';
import { Schema } from '../../../';
import { mongodb } from '../../../../config';
import { Database } from '../../../models';
import resolver from '../resolver';

const database = new Database({
  ...mongodb,
  database: 'test',

});

let user;

beforeAll(async () => {
  await database.connect();
  await database.connection.dropDatabase();

  // Fixed new Date
  const FIXED_DATE = new Date(Date.UTC(2017, 7, 9, 8));
  (global as any).Date = jest.fn((...input) => FIXED_DATE);

  // Init test database
  user = await database.User.create({
    _id: '5a10494ee67657f236e6b0a2',
    first_name: 'Ammarin',
    last_name: 'Jetthakun',
    tel_number: '0123456789',
    account: {
      email: 'ammarinjtk@gmail.com',
      password: 'donttell',
    },
    avatar: 'someurl',
  });

  // await database.Product.create({
  //   name: 'Zara',
  //   description: 'Zara clothes',
  //   original_price: 1000,
  //   type: 'BuyNowProduct',
  //   price: 800,
  //   picture: ['https://th-live-02.slatic.net/p/7/hequ-1483111676-123106' +
  //     '5-c566b543a82cfe5a0e279dbf161bd13e-catalog_233.jpg'],
  //   hashtag: ['uniqlo'],
  //   colors: ['red'],
  //   sizes: ['S'],
  //   promotion_start: new Date(2017, 13, 1, 12),
  //   promotion_end: new Date(2017, 14, 1, 19),
  //   owner: user._id,
  //   createAt: new Date(2017, 13, 1, 8),
  //   updateAt: new Date(2017, 13, 1, 8),
  // });
});

afterAll(() => database.close());

it('Mutation createProduct should insert new product into mongodb', async () => {
  await resolver.Mutation.createProduct({}, {
    input: {
      _id: '585b11e7adb8b5f2d655da01',
      name: 'a',
      type: 'Product',
      pictures: ['https://th-live-02.slatic.net/p/7/hequ-1483111676-123106' +
        '5-c566b543a82cfe5a0e279dbf161bd13e-catalog_233.jpg'],
      hashtags: ['a', 'b', 'c'],
      colors: ['red'],
      size: ['S'],
      promotionStart: new Date(),
      promotionEnd: new Date(),
      owner: user._id,
    },
  }, { database });

  // Number of product in database should be 1.
  const count = await database.Product.find().count();
  expect(count).toMatchSnapshot();
  // Product should create in database.
  const products = await database.Product.find().toArray();
  expect(products).toMatchSnapshot();
  // Should be able to find a product that has been created.
  const product = await database.Product.findOne({ name: 'a' });
  expect(product).toMatchSnapshot();
});

// it('Mutation editPrice should change price of product', async () => {
//   const product = await database.Product.findOne({
//     name: 'Zara',
//   });
//   await resolver.Mutation.editPrice({
//     product: product._id,
//     price: 100,
//   });

//   const expect_product = await database.Product.findOne({
//     name: 'Zara',
//   });
//   expect(expect_product.price)
//     .toEqual(100);
// });
