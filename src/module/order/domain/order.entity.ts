import { Cart } from '@module/cart/domain/cart.entity';
import { OrderItem } from '@module/order/domain/order-item.interface';
import { OrderStatus } from '@module/order/domain/order-status';

import { Base } from '@common/base/domain/base.entity';

export class Order extends Base {
  status: OrderStatus;

  totalAmount: string;

  items: OrderItem[];

  mpOrderId?: string;

  cart: Cart;
}
