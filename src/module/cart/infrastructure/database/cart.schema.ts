import { CartItem } from '@module/cart/domain/cart-item.entity';
import { CART_STATUS } from '@module/cart/domain/cart-status';
import { Cart } from '@module/cart/domain/cart.entity';
import { User } from '@module/iam/user/domain/user.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

export const CartSchema = new EntitySchema<Cart>({
  name: Cart.name,
  target: Cart,
  tableName: 'cart',
  columns: withBaseSchemaColumns({
    status: {
      type: 'simple-enum',
      enum: CART_STATUS,
      default: CART_STATUS.ACTIVE,
    },
  }),
  relations: {
    user: {
      type: 'many-to-one',
      target: User.name,
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: true,
    },
    items: {
      type: 'one-to-many',
      target: CartItem.name,
      inverseSide: 'cart',
    },
  },
});
