import { IColor, ISize } from '../../models/Product/productdetail';
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

    picture: string[];
    hashtag: string[];
    colors?: IColor[];
    sizes?: ISize[];

    promotionStart: Date;
    promotionEnd: Date;
    owner: IUser;
}

export {
    resolver,
    type,
    IProduct,
};
