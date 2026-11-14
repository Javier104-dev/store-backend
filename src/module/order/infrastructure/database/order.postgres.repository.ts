import { Order } from '@module/order/domain/order.entity';
import { OrderSchema } from '@module/order/infrastructure/database/order.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IGetOneOptions } from '@common/base/get-all-options.interface';
import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class OrderPostgresRepository extends BaseRepository<Order> {
  constructor(
    @InjectRepository(OrderSchema)
    protected readonly repository: Repository<Order>,
  ) {
    super(repository);
  }

  async getOrderById(
    id: string,
    options?: IGetOneOptions<Order>,
  ): Promise<Order | null> {
    const { relations } = options || {};

    return this.repository.findOne({
      where: {
        id,
      },
      ...(relations && { relations }),
    });
  }
}
