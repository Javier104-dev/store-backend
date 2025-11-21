import { User } from '@module/iam/user/domain/user.entity';
import { Product } from '@module/product/domain/product.entity';
import { Store } from '@module/store/domain/store.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

export const StoreSchema = new EntitySchema<Store>({
  name: Store.name,
  target: Store,
  tableName: 'store',
  columns: withBaseSchemaColumns({
    name: {
      type: String,
      nullable: false,
    },
    ownerId: {
      type: String,
      nullable: false,
    },
  }),
  relations: {
    owner: {
      type: 'one-to-one',
      target: User.name,
      joinColumn: {
        name: 'owner_id',
      },
      nullable: false,
      onDelete: 'CASCADE',
      inverseSide: 'store',
    },
    products: {
      type: 'one-to-many',
      target: Product.name,
      inverseSide: 'store',
    },
  },
});
