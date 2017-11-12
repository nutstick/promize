import * as Iridium from 'iridium';
import { Collection, Index, Instance, ObjectID, Property } from 'iridium';

interface IProductDocument {
  _id?: string;
  name: string;
  description?: string;

  price: number;

  picture?: string[];
  hashtag?: string[];
  colors?: string[];
  sizes?: string[];

  promotion_start: Date;
  promotion_end: Date;
  owner_name: string;

  createAt?: Date;
  updateAt?: Date;
}

@Index({
  name: 1,
  hastag: 1,
  promotion_start: 0,
})
@Collection('products')
class Product extends Instance<IProductDocument, Product> implements IProductDocument {
  @ObjectID
  _id: string;
  @Property(/^.+$/, true)
  name: string;
  @Property(String, false)
  description: string;

  @Property(Number, true)
  price: number;

  @Property([String], false)
  picture: string[];
  @Property([String], false)
  hashtag: string[];
  @Property([String], false)
  colors: string[];
  @Property([String], false)
  sizes: string[];

  @Property(Date, true)
  promotion_start: Date;
  @Property(Date, true)
  promotion_end: Date;

  @Property(String, true)
  owner_name: string;

  @Property(Date, false)
  createAt: Date;
  @Property(Date, false)
  updateAt: Date;

  static onCreating(product: IProductDocument) {
    product.createAt = new Date();
    product.updateAt = new Date();
  }

  static onSaving(product: Product, changes: Iridium.Changes) {
    product.updateAt = new Date();
  }
}

export { IProductDocument, Product };
