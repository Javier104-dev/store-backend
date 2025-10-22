import { User } from '@module/iam/user/domain/user.entity';
import { Product } from '@module/product/domain/product.entity';
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
    sellerId: {
      type: String,
      nullable: true,
    },
  }),
  relations: {
    user: {
      type: 'many-to-one',
      target: User.name,
      joinColumn: {
        name: 'seller_id',
      },
      nullable: true,
      onDelete: 'CASCADE',
      inverseSide: 'products',
    },
  },
});
