import { INode } from '../Pagination';
import { IUser } from '../User';
import resolver from './resolver';
import * as type from './typeDef.gql';

interface IProduct extends INode {
    name: string;
    description?: string;

    type: string;
    originalPrice?: number;
    price?: number;

    pictures: string[];
    hashtags: string[];
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
