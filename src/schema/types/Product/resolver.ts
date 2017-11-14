import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
    Product: {
        promotionStart({ promotion_start }) {
            return promotion_start;
        },
        promotionEnd({ promotion_end }) {
            return promotion_end;
        },
        ownerName({ owner_name }) {
            return owner_name;
        },
        async search(_, { keyword }, { database }) {
            return await database.Product.find({
                $or: [
                    { hashtag: keyword },
                    { name: keyword },
                    { owner_name: keyword },
                ],
            });
        },
    },

};

export default resolver;
