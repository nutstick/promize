import * as Iridium from 'iridium';
import { Collection, Index, Instance, ObjectID, Property, Transform } from 'iridium';
import { ObjectID as id } from 'mongodb';
import { Category, Color, ICategory, IColor, ISize, Size } from './productdetail';

interface IProductDocument {
  _id?: string;
  name: string;
  description?: string;

  type?: string;
  original_price?: number;
  price?: number;

  pictures: string[];
  hashtags: string[];
  colors?: IColor[];
  sizes?: ISize[];
  categories?: ICategory[];

  promotion_start: Date;
  promotion_end: Date;
  owner: string;

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

  @Property(String, false)
  type: string;
  @Property(Number, false)
  original_price: number;
  @Property(Number, false)
  price: number;

  @Property([String], true)
  pictures: string[];
  @Property([String], true)
  hashtags: string[];
  // Color
  @Transform(
    (value) => value,
    (value) => value && value.map((color) => color._id ? color : { ...color, _id: new id() }),
  )
  @Property([Color], false)
  colors: IColor[];
  // Size
  @Transform(
    (value) => value,
    (value) => value && value.map((size) => size._id ? size : { ...size, _id: new id() }),
  )
  @Property([Size], false)
  sizes: ISize[];
  // Category
  @Transform(
    (value) => value,
    (value) => value && value.map((category) => category._id ? category : { ...category, _id: new id() }),
  )
  @Property([Category], false)
  categories: ICategory[];

  @Property(Date, true)
  promotion_start: Date;
  @Property(Date, true)
  promotion_end: Date;

  @Property(String, true)
  owner: string;

  @Property(Date, false)
  createAt: Date;
  @Property(Date, false)
  updateAt: Date;

  static onCreating(product: IProductDocument) {
    product.createAt = new Date();
    product.updateAt = new Date();

    if (product.original_price) {
      product.type = 'BuyNowProduct';
    } else {
      product.type = 'Product';
    }
  }

  static onSaving(product: Product, changes: Iridium.Changes) {
    product.updateAt = new Date();
  }
}

export { IProductDocument, Product };
