import generate from 'babel-generator';
import { Database } from '../src/schema/models';
// tslint:disable-next-line:no-var-requires
const m = require('casual');

// Pass generator as callback
const array_of = (times, generator) => {
  return Array.apply(null, Array(times)).map(() => generator());
};

const start_date = m.moment;
const end_date = start_date.add(Math.floor(Math.floor(Math.random() * 60)), 'days');

export async function seed(database: Database) {
  // Clear database
  await database.connection.dropDatabase();
  // Start seeding
  for (let i = 0; i <= 20; i++) {
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

    // mm.ra
    for (let j = 0; j <= Math.floor(Math.random() * 4); j++) {
      await database.Product.create({
        name: m.word,
        description: m.description,

        price: m.integer(100, 2000),

        picture: ['https://th-live-02.slatic.net/p/7/hequ-1483111676-123106' +
          '5-c566b543a82cfe5a0e279dbf161bd13e-catalog_233.jpg'],
        hashtag: array_of(Math.floor(Math.random() * 3), () => m.word),
        colors: array_of(Math.floor(Math.random() * 3), () => m.color_name),
        sizes: array_of(Math.floor(Math.random() * 3), () => m.random_element(['S', 'M', 'L'])),

        promotion_start: start_date.toDate(),
        promotion_end: end_date.toDate(),
        owner: user._id,
      });
    }
  }

}
