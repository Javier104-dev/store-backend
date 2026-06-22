import { CartItem } from '@module/cart/domain/cart-item.entity';
import { Cart } from '@module/cart/domain/cart.entity';
import { Product } from '@module/product/domain/product.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

export const CartItemSchema = new EntitySchema<CartItem>({
  name: CartItem.name,
  target: CartItem,
  tableName: 'cart_item',
  columns: withBaseSchemaColumns({
    quantity: {
      type: 'int',
    },
    unitPrice: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
  }),
  relations: {
    cart: {
      type: 'many-to-one',
      target: Cart.name,
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: true,
    },
    product: {
      type: 'many-to-one',
      target: Product.name,
      nullable: true,
      onDelete: 'SET NULL',
      joinColumn: true,
    },
  },
});
