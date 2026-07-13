import { CartMapper } from '@module/cart/application/mapper/cart.mapper';
import {
  CART_REPOSITORY_KEY,
  ICartRepository,
} from '@module/cart/application/repository/cart.repository.interface';
import { CART_STATUS } from '@module/cart/domain/cart-status';
import { Cart } from '@module/cart/domain/cart.entity';
import { UserService } from '@module/iam/user/application/service/user.service';
import { Inject, Injectable } from '@nestjs/common';

import { IGetOneOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY_KEY)
    protected readonly repository: ICartRepository,
    protected readonly userService: UserService,
    private readonly cartMapper: CartMapper,
  ) {}

  async saveCart(cart: Cart): Promise<Cart> {
    return this.repository.saveOne(cart);
  }

  async getActiveCartByUserId(userId: string): Promise<Cart> {
    const options: IGetOneOptions<Cart> = {
      filter: { status: CART_STATUS.ACTIVE },
      relations: ['items', 'items.product', 'items.product.upload'],
      order: {
        items: { createdAt: 'ASC' },
      },
    };
    return this.repository.getCartByUserId(userId, options);
  }

  async getActiveCartOrCreateByUserId(userId: string): Promise<Cart> {
    const options: IGetOneOptions<Cart> = {
      filter: { status: CART_STATUS.ACTIVE },
    };

    let cart = await this.repository.getCartByUserId(userId, options);

    if (!cart) {
      const user = await this.userService.getUserByIdOrFail(userId);
      cart = await this.saveCart(
        this.cartMapper.toEntity<Cart>({
          user,
        }),
      );
    }

    return cart;
  }
}
