import * as Iridium from 'iridium';
import { Collection, Index, Instance, ObjectID, Property } from 'iridium';
import { Color, IColor, ISize, Size } from '../Product/productdetail';
import { Address, IAddress } from '../User/address';
import { IPaymentMethod, PaymentMethod } from '../User/paymentmethod';

interface IReceiptDocument {
    _id?: string;
    product: string;

    size: string;
    color: string;
    number_of_items: number;

    buyer: string;

    deliver_address?: string;
    tracking_id?: string;
    remark?: string;

    createAt?: Date;
    updateAt?: Date;

    payment_method?: string;
    payment_completed_at?: Date;
    payment_completed?: boolean;

    product_delivered_at?: Date;
    product_delivered?: boolean;

    product_received_at?: Date;
    product_received?: boolean;
}

@Index({
    buyer: 1,
    product: 1,
})
@Collection('receipts')
class Receipt extends Instance<IReceiptDocument, Receipt> implements IReceiptDocument {

    @ObjectID
    _id: string;

    @Property(String, true)
    product: string;

    @Property(String, true)
    size: string;
    @Property(String, true)
    color: string;
    @Property(Number, true)
    number_of_items: number;

    @Property(String, true)
    buyer: string;

    @Property(String, false)
    deliver_address: string;
    @Property(String, false)
    tracking_id: string;
    @Property(String, false)
    remark: string;

    @Property(Date, false)
    createAt: Date;
    @Property(Date, false)
    updateAt: Date;

    @Property(String, false)
    payment_method: string;

    @Property(Date, false)
    payment_completed_at: Date;
    @Property(Boolean, false)
    payment_completed: boolean;

    @Property(Date, false)
    product_delivered_at: Date;
    @Property(Boolean, false)
    product_delivered: boolean;

    @Property(Date, false)
    product_received_at: Date;
    @Property(Boolean, false)
    product_received: boolean;

    static onCreating(receipt: IReceiptDocument) {
        receipt.createAt = new Date();
        receipt.updateAt = new Date();
        receipt.payment_completed = false;
        receipt.product_delivered = false;
        receipt.product_received = false;
    }

    static onSaving(receipt: Receipt, changes: Iridium.Changes) {
        receipt.updateAt = new Date();
    }
}

export { IReceiptDocument, Receipt };
