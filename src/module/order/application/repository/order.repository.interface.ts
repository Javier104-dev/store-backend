import { Order } from '@module/order/domain/order.entity';

import { IGetOneOptions } from '@common/base/get-all-options.interface';
import IRepository from '@common/base/infrastructure/database/repository.interface';

export const ORDER_REPOSITORY_KEY = 'order_repository';

export interface IOrderRepository extends IRepository<Order> {
  getOrderById(
    id: string,
    options?: IGetOneOptions<Order>,
  ): Promise<Order | null>;
}
