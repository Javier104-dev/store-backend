import { Cart } from '@module/cart/domain/cart.entity';
import { ORDER_STATUS } from '@module/order/domain/order-status';
import { Order } from '@module/order/domain/order.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

export const OrderSchema = new EntitySchema<Order>({
  name: Order.name,
  target: Order,
  tableName: 'order',
  columns: withBaseSchemaColumns({
    status: {
      type: 'simple-enum',
      enum: ORDER_STATUS,
      default: ORDER_STATUS.PENDING,
    },
    totalAmount: {
      type: String,
    },
    items: {
      type: 'jsonb',
    },
    mpOrderId: {
      type: String,
      nullable: true,
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
  },
});
