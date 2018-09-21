import { seed } from '../seeds/mongo-seed';
import { database } from '../src/schema/models';

/**
 * Seeds database.
 */
async function seeds() {
  console.log('Connecting');
  await database.connect();
  await seed(database);
  console.log('Done');
  await database.close();
}

export default seeds;
