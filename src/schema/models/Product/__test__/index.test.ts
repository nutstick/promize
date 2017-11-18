import { Core, Model } from 'iridium';
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
const user_model = new Model<IUserDocument, User>(core, User);

// Pass generator as callback
const array_of = (times, generator) => {
    return Array.apply(null, Array(times)).map(() => generator());
};

const start_date = m.moment;
const end_date = start_date.add(Math.floor(Math.floor(Math.random() * 60)), 'days');

beforeAll(() => core.connect());

afterAll(() => core.close());

describe('Product Model', () => {
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

        expect(product).not.toBeNull();
    });
});
