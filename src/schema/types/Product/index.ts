import { IUser } from '../User';
import resolver from './resolver';
import * as type from './typeDef.gql';

interface IProduct {
    _id?: string;
    name: string;
    description?: string;

    type: string;
    originalPrice?: number;
    price?: number;

    picture: string[];
    hashtag: string[];
    colors?: string[];
    sizes?: string[];

    promotionStart: Date;
    promotionEnd: Date;
    owner: IUser;
}

export {
    resolver,
    type,
    IProduct,
};
