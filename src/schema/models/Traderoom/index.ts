import * as Iridium from 'iridium';
import { Collection, Index, Instance, Model, ObjectID, Property } from 'iridium';
import { IMessage, Message } from './message';

interface ITraderoom {
    _id?: string;
    order_product?: string;
    detail?: string;
    price: number;

    number_of_item?: number;
    size?: string;
    color?: string;

    buy_confirm: boolean;
    buy_confirm_at?: Date;

    messages?: IMessage[];

    createAt?: Date;
    updateAt?: Date;
}

@Collection('traderooms')
class Traderoom extends Instance<ITraderoom, Traderoom> implements ITraderoom {
    @ObjectID
    _id: string;

    @Property(String, false)
    order_product: string;
    @Property(String, false)
    detail: string;
    @Property(Number, true)
    price: number;

    @Property(Number, false)
    number_of_item: number;
    @Property(String, false)
    size: string;
    @Property(String, false)
    color: string;

    @Property(Boolean, true)
    buy_confirm: boolean;
    @Property(Date, false)
    buy_confirm_at: Date;

    @Property([Message], false)
    messages: IMessage[];

    static onCreating(traderooms: ITraderoom) {
        traderooms.createAt = new Date();
        traderooms.updateAt = new Date();
        traderooms.buy_confirm = false;
    }

    static onSaving(traderooms: Traderoom, changes: Iridium.Changes) {
        traderooms.updateAt = new Date();
    }
}

export { ITraderoom, Traderoom };
