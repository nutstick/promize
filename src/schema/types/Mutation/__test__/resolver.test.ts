import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { graphql } from 'graphql';
import gql from 'graphql-tag';
import * as MockDate from 'mockdate';
import { Schema } from '../../../';
import { mongodb } from '../../../../config';
import { ServerLink } from '../../../../core/ServerLink';
import { Database } from '../../../models';
import { IOrderReceipt } from '../../OrderReceipt/index';
import resolver from '../resolver';

interface Mutation {
  createOrderReceipt: IOrderReceipt;
}

const mutation = gql`mutation CreateOrderReceipt {
  createOrderReceipt (input: CreateOrderReceiptInput){
    createOrderReceipt(input: $input)
  }
}`;

const database = new Database({
  ...mongodb,
  database: 'test',
});

let user;

beforeAll(async (done) => {
  await database.connect();
  await database.connection.dropDatabase();

  // Fixed new Date
  MockDate.set('7/9/2017');

  // Init test database
  user = await database.User.create({
    _id: '5a10494ee67657f236e6b0a2',
    first_name: 'Ammarin',
    last_name: 'Jetthakun',
    tel_number: '0123456789',
    gender: 'Male',
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

  done();
});

afterAll(async (done) => {
  await database.close();

  // Reset mock date
  MockDate.reset();

  done();
});

it('Mutation createProduct should insert new product into mongodb', async () => {
  await resolver.Mutation.createProduct({}, {
    input: {
      _id: '585b11e7adb8b5f2d655da01',
      name: 'a',
      type: 'Product',
      pictures: ['https://th-live-02.slatic.net/p/7/hequ-1483111676-123106' +
        '5-c566b543a82cfe5a0e279dbf161bd13e-catalog_233.jpg'],
      hashtags: ['a', 'b', 'c'],
      colors: [{
        color: 'red',
      }],
      sizes: [{
        size: 'S',
      }],
      promotionStart: new Date(),
      promotionEnd: new Date(),
      owner: user._id,
    },
  }, { database });

  // Should be able to find a product that has been created.
  const product = await database.Product.findOne({ name: 'a' });
  // TODO: expect all fields
  // expect(deepRemoveFields(product, ['_id'])).toMatchSnapshot();
  // expect(product).toMatchSnapshot();
});

// describe('GraphQL Mutation', () => {
//   it('createOrderReceipt', () => {
//     const client = new ApolloClient({
//       link: new ServerLink({
//         schema: Schema,
//       }),
//       cache: new InMemoryCache(),
//       ssrMode: true,
//     });

//     const variables = {
//       input: {
//         product: '585b11e7adb8b5f2d655da01',
//         size: { size: 'S' },
//         color: { color: 'red' },
//         deliverAddress: '585b11e7adb8b5f2d655da01',
//         paymentMethod: '585b11e7adb8b5f2d655da01',
//         remark: 'note something',
//       },
//     };

//     return client.mutate<Mutation>({
//       mutation,
//       variables,
//     })
//       .then(async () => {
//         const receipt = await database.Receipt.findOne(variables.input);
//         expect(receipt).toMatchSnapshot();
//       });
//   });
// });

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
