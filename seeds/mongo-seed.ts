import generate from 'babel-generator';
import { readFileSync } from 'fs';
import { ObjectID as id } from 'mongodb';
import { Database } from '../src/schema/models';
// tslint:disable-next-line:no-var-requires
const m = require('casual');
let rawdata = readFileSync('/app/seeds/data.json', 'utf-8');
rawdata = JSON.parse(rawdata);
const chunkUserItem = [];
const chunk = 10;
for (let i = 0; i <= rawdata.length; i += chunk) {
  chunkUserItem.push(rawdata.slice(i, i + chunk));
}
const numberOfUser = chunkUserItem.length;

// Pass generator as callback
const array_of = (times, generator) => {
  return Array.apply(null, Array(times)).map(() => generator());
};

export async function seed(database: Database) {
  // Clear database
  await database.connection.dropDatabase();
  // Start seeding
  for (let i = 0; i <= numberOfUser; i++) {
    const first_name = m.first_name;
    const seller = await database.User.create({
      first_name,
      last_name: m.last_name,
      tel_number: m.phone,
      gender: m.random_element(['male', 'female']),
      account: {
        email: first_name.toLowerCase() + '@hotmail.com',
        password: '123456',
      },
      avatar: 'https://www.realmadrid.com/img/cuadrada_300px/cristiano1.jpg',
      type: 'CoSeller',
    });
    // console.log(chunkUserItem[i][0]);
    // mm.ra
    if (typeof chunkUserItem[i] === 'undefined') {
      continue;
    }
    for (let j = 0; j <= chunkUserItem[i].length; j++) {
      // console.log(j);
      const start_date = m.moment;
      const end_date = start_date.add(Math.floor(Math.floor(Math.random() * 60)), 'days');
      const product_data = chunkUserItem[i][j];
      if (typeof product_data === 'undefined') {
        continue;
      }
      const colors = JSON.parse(product_data.color);
      const sizes = JSON.parse(product_data.size);
      // console.log(product_data);
      const product = await database.Product.create({
        name: product_data.title,
        description: product_data.description,
        type: 'BuyNowProduct',
        price: parseInt(product_data.price, 10),
        original_price: parseInt(product_data.old_price, 10),
        pictures: product_data.img_url,
        hashtags: array_of(Math.floor(Math.random() * 3), () => m.random_element([
          'uniqlo', 'HandM', 'AIIZ', 'GAP', 'Crocs', 'anello', 'kanken',
        ])),
        colors,
        sizes,
        categories: [{ category: product_data.category }],

        promotion_start: start_date.toDate(),
        promotion_end: end_date.toDate(),
        owner: seller._id,
      });

      for (let k = 0; k <= Math.floor(Math.random() * 5); k++) {
        const user = await database.User.create({
          first_name: m.first_name,
          last_name: m.last_name,
          tel_number: m.phone,
          gender: m.random_element(['male', 'female']),
          account: {
            email: m.email,
            password: m.password,
          },
          avatar: 'https://www.realmadrid.com/img/cuadrada_300px/cristiano1.jpg',
          type: 'User',
        });
        // await database.Receipt.create({
        //   buyer: user._id,
        //   product: product._id,
        //   size: product.sizes[0]._id,
        //   color: product.colors[0]._id,
        // });
      }
    }
  }

}
