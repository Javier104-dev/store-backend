import { Category } from '@module/category/domain/category.entity';
import { Product } from '@module/product/domain/product.entity';
import { Store } from '@module/store/domain/store.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

export const ProductSchema = new EntitySchema<Product>({
  name: Product.name,
  target: Product,
  tableName: 'product',
  columns: withBaseSchemaColumns({
    name: {
      type: String,
      nullable: false,
    },
    price: {
      type: 'float',
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: false,
    },
  }),
  relations: {
    store: {
      type: 'many-to-one',
      target: Store.name,
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: true,
    },
    categories: {
      type: 'many-to-many',
      target: Category.name,
      joinTable: true,
      inverseSide: 'products',
    },
  },
});
