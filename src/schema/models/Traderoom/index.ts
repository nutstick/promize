import * as Iridium from 'iridium';
import { Collection, Instance, ObjectID, Property } from 'iridium';

interface ITraderoomDocument {
    _id?: string;

    participants: string[];
    order_product?: string;
    detail?: string;
    price: number;

    number_of_item?: number;
    size?: string;
    color?: string;

    buy_confirm?: boolean;
    buy_confirm_at?: Date;

    createAt?: Date;
    updateAt?: Date;
}

@Collection('traderooms')
class Traderoom extends Instance<ITraderoomDocument, Traderoom> implements ITraderoomDocument {
    @ObjectID
    _id: string;
    @Property([String], true)
    participants: string[];

    @Property(String, false)
    order_product: string;
    @Property(String, false)
    detail: string;
    @Property(Number, false)
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

    static onCreating(traderooms: ITraderoomDocument) {
        traderooms.createAt = new Date();
        traderooms.updateAt = new Date();
        traderooms.buy_confirm = false;
    }

    static onSaving(traderooms: Traderoom, changes: Iridium.Changes) {
        traderooms.updateAt = new Date();
    }
}

export { ITraderoomDocument, Traderoom };
