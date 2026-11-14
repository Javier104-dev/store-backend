import { Cart } from '@module/cart/domain/cart.entity';
import { OrderMapper } from '@module/order/application/mapper/order.mapper';
import {
  IOrderRepository,
  ORDER_REPOSITORY_KEY,
} from '@module/order/application/repository/order.repository.interface';
import { OrderItem } from '@module/order/domain/order-item.interface';
import { ORDER_STATUS, OrderStatus } from '@module/order/domain/order-status';
import { Order } from '@module/order/domain/order.entity';
import { Inject, Injectable } from '@nestjs/common';

import { IGetOneOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY_KEY)
    private readonly repository: IOrderRepository,
    private readonly orderMapper: OrderMapper,
  ) {}

  async createFromCart(
    cart: Cart,
    items: OrderItem[],
    totalAmount: string,
  ): Promise<Order> {
    const order = this.orderMapper.toEntity<Order>({
      cart,
      items,
      totalAmount,
      status: ORDER_STATUS.PENDING,
    });
    return this.repository.saveOne(order);
  }

  async saveMpOrderId(orderId: string, mpOrderId: string): Promise<Order> {
    return this.updateOrderOrFail(orderId, {
      mpOrderId,
    });
  }

  async getOrderById(orderId: string): Promise<Order> {
    const options: IGetOneOptions<Order> = {
      relations: ['cart'],
    };

    return this.repository.getOrderById(orderId, options);
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    return this.updateOrderOrFail(orderId, {
      status,
    });
  }

  private async updateOrderOrFail(
    orderId: string,
    updateOder: Partial<Order>,
  ): Promise<Order> {
    return this.repository.updateOneOrFail(
      orderId,
      this.orderMapper.toEntity<Order>(updateOder),
    );
  }
}
