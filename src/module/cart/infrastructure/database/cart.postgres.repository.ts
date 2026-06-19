import { Cart } from '@module/cart/domain/cart.entity';
import { CartSchema } from '@module/cart/infrastructure/database/cart.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IGetOneOptions } from '@common/base/get-all-options.interface';
import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class CartPostgresRepository extends BaseRepository<Cart> {
  constructor(
    @InjectRepository(CartSchema)
    protected readonly repository: Repository<Cart>,
  ) {
    super(repository);
  }

  async getCartByUserId(
    userId: string,
    options?: IGetOneOptions<Cart>,
  ): Promise<Cart> {
    const { filter, relations } = options || {};

    const fullFilter = {
      where: {
        user: { id: userId },
        ...filter,
      },
      ...(relations && { relations }),
    };

    return this.getOne(fullFilter);
  }

  async getOne(options: IGetOneOptions<Cart>): Promise<Cart> {
    return this.repository.findOne(options);
  }
}
