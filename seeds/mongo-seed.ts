import { Database } from '../src/schema/models';

// tslint:disable-next-line:no-var-requires
const m = require('casual');

export async function seed(database: Database) {
  // Clear database
  await database.connection.dropDatabase();
  // Start seeding
  await database.User.create({
    first_name: m.first_name,
    last_name: m.last_name,
    tel_number: m.phone,
    account: {
      email: m.email,
      password: m.password,
    },
    avatar: m.url,
  });
}
