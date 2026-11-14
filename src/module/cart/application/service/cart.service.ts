import { CartMapper } from '@module/cart/application/mapper/cart.mapper';
import {
  CART_REPOSITORY_KEY,
  ICartRepository,
} from '@module/cart/application/repository/cart.repository.interface';
import { CART_STATUS, CartStatus } from '@module/cart/domain/cart-status';
import { Cart } from '@module/cart/domain/cart.entity';
import { CartNotFoundException } from '@module/cart/infrastructure/exception/cart-not-found.exception';
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

  async saveCart(createCart: Partial<Cart>): Promise<Cart> {
    const cart = this.cartMapper.toEntity<Cart>(createCart);
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
      const user = await this.userService.getUserEntityByIdOrFail(userId);
      cart = await this.saveCart({ user });
    }

    return cart;
  }

  async getActiveCartByUserIdOrFail(userId: string): Promise<Cart> {
    const options: IGetOneOptions<Cart> = {
      filter: { status: CART_STATUS.ACTIVE },
      relations: ['items', 'items.product'],
    };

    const cart = await this.repository.getCartByUserId(userId, options);

    if (!cart) {
      throw new CartNotFoundException({
        message: `Cart not found`,
      });
    }

    return cart;
  }

  async updateStatus(cartId: string, status: CartStatus): Promise<Cart> {
    return this.repository.updateOneOrFail(
      cartId,
      this.cartMapper.toEntity<Cart>({
        status,
      }),
    );
  }
}
