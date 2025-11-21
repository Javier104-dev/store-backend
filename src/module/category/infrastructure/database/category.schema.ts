import { Category } from '@module/category/domain/category.entity';
import { Product } from '@module/product/domain/product.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

export const CategorySchema = new EntitySchema<Category>({
  name: Category.name,
  target: Category,
  tableName: 'category',
  columns: withBaseSchemaColumns({
    name: {
      type: String,
      nullable: false,
    },
  }),
  relations: {
    products: {
      type: 'many-to-many',
      target: Product.name,
      inverseSide: 'categories',
    },
  },
});
