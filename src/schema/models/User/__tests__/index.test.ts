import { Core, Model } from 'iridium';
import { IUserDocument, User } from '../';
import { mongodb } from '../../../../config';

// tslint:disable-next-line:no-var-requires
const m = require('casual');

const core = new Core({
  ...mongodb,
  database: 'test',
});

const model = new Model<IUserDocument, User>(core, User);

beforeAll(() => core.connect());

afterAll(() => core.close());

describe('User Model', () => {
  it('User create correctly', async () => {
    const user = await model.create({
      first_name: m.first_name,
      last_name: m.last_name,
      tel_number: m.phone,
      gender: m.random_element(['male', 'female']),
      account: {
        email: m.email,
        password: m.password,
      },
      avatar: m.url,
    });

    expect(user).not.toBeNull();
  });
});
