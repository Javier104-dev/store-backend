import { CartItem } from '@module/cart/domain/cart-item.entity';
import { CartItemSchema } from '@module/cart/infrastructure/database/cart-item.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IGetOneOptions } from '@common/base/get-all-options.interface';
import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class CartItemPostgresRepository extends BaseRepository<CartItem> {
  constructor(
    @InjectRepository(CartItemSchema)
    protected readonly repository: Repository<CartItem>,
  ) {
    super(repository);
  }

  async getCartItem(options?: IGetOneOptions<CartItem>): Promise<CartItem> {
    const { filter, relations, order } = options || {};

    const fullFilter = {
      ...(filter && { where: filter }),
      ...(relations && { relations }),
      ...(order && { order }),
    };

    return this.repository.findOne(fullFilter);
  }
}
