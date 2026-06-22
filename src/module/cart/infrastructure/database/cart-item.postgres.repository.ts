import { CartItem } from '@module/cart/domain/cart-item.entity';
import { CART_STATUS } from '@module/cart/domain/cart-status';
import { CartItemSchema } from '@module/cart/infrastructure/database/cart-item.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class CartItemPostgresRepository extends BaseRepository<CartItem> {
  constructor(
    @InjectRepository(CartItemSchema)
    protected readonly repository: Repository<CartItem>,
  ) {
    super(repository);
  }

  async getActiveCartItemByUser(
    cartItemId: string,
    userId: string,
  ): Promise<CartItem> {
    return this.repository.findOne({
      where: {
        id: cartItemId,
        cart: { user: { id: userId }, status: CART_STATUS.ACTIVE },
      },
    });
  }
}
