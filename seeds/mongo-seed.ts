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

        // price: m.integer(100, 2000),

        picture: array_of(Math.floor(Math.random() * 3) + 1, () => m.random_element([
          'https://th-live-02.slatic.net/p/7/hequ-1483111676-123106' +
          '5-c566b543a82cfe5a0e279dbf161bd13e-catalog_233.jpg',
          'https://www.fjallraven.com/media/catalog/product/cache/all/base/522x/' +
          '17f82f742ffe127f42dca9de82fb58b1/F/2/F23510-501_0.jpg',
          'https://i.ytimg.com/vi/6d0YVd3AE7A/maxresdefault.jpg',
          'http://www.bag-design.com/th/wp-content/uploads/2015/10/eco-bag-14.jpg',
          'http://static.weloveshopping.com/shop/client/000054/rakbag/Sunny-683beige.jpg',
          'https://media.shopat24.com/SWISS_GEAR_KW_044_17_/plist/812192_010_01.jpg',
          'http://fb1-e.lnwfile.com/_/e/_raw/mc/p4/hs.jpg',
          'http://www.cleothailand.com/wp-content/uploads/2017/03/vanmakeup.jpg',
          'https://cache.gmo2.sistacafe.com/images/uploads/summary/image/2218/144047' +
          '4904-il_fullxfull.579898122_8i89.jpg',
          'http://xn--72ca1ci1cwcl0bg2l5d.ran4u.com/userfiles/fckeditor/9905/image/%E0%B' +
          '8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%9F%' +
          'E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%20%E0%B8%97%E0%B8%A3%E0%B8%87%20Boart%20Shoes%20C041.jpg',
          'https://i.pinimg.com/736x/76/97/bf/7697bf24d1504cb5d928d08f0379da55--nike-air-max-air-maxes.jpg',
          'https://th-live-02.slatic.net/p/7/ccjeans-a005-white-black-1488943952-25827721' +
          '-0e7268f29102c8723fdc5f2bc9253c6e-product_340x340.jpg',
          'http://www.mixytrend.com/attachments/product/images_1-1953773.jpg',
          'http://www.mixytrend.com/attachments/product/images_1-1944858.jpg',
          'https://f.ptcdn.info/144/041/000/o4fn49dowqyEVv46x81-o.jpg',
          'https://th-live.slatic.net/p/7/kaangekngsaelkhe-wyuued-4009-9009409-ab7fca3d9e73' +
          'fb0cd3674c958ec21c58-webp-zoom_850x850.jpg',
          'https://pbs.twimg.com/media/CyrAVXoWgAAkK7f.jpg',
          'https://th-live-01.slatic.net/p/7/orawan-closet-1453777645-9137834-1-product.jpg',
          'https://www.daradaily.com/module/ckfinder/userfiles/images/Gucci.jpg',
          'https://th-live-03.slatic.net/p/7/good-no01-white-red-1477598042-30347' +
          '78-40f2862575713c4af13f9311e749ec64-product.jpg',
          'https://th-live-02.slatic.net/p/7/wonderful-story-v2-black-1487311' +
          '424-72902911-dc6fe5a76db1271801bfe09daefc8587-catalog_233.jpg',
        ])),
        hashtag: array_of(Math.floor(Math.random() * 3), () => m.random_element([
          'uniqlo', 'HandM', 'AIIZ', 'GAP', 'Crocs', 'anello', 'kanken',
        ])),
        colors: array_of(Math.floor(Math.random() * 3), () => m.color_name),
        sizes: array_of(Math.floor(Math.random() * 3), () => m.random_element(['S', 'M', 'L', 'XL', 'XXL'])),

        promotion_start: start_date.toDate(),
        promotion_end: end_date.toDate(),
        owner: user._id,
      });
    }
  }

}
