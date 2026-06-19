import {
  CART_REPOSITORY_KEY,
  ICartRepository,
} from '@module/cart/application/repository/cart.repository.interface';
import { Cart } from '@module/cart/domain/cart.entity';
import { Inject, Injectable } from '@nestjs/common';

import { IGetOneOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY_KEY)
    protected readonly repository: ICartRepository,
  ) {}

  async saveCart(cart: Cart): Promise<Cart> {
    return this.repository.saveOne(cart);
  }

  async getCartByUserId(
    userId: string,
    options?: IGetOneOptions<Cart>,
  ): Promise<Cart> {
    return this.repository.getCartByUserId(userId, options);
  }
}
