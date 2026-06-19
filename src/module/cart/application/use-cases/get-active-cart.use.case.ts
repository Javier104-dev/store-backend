import { CartDto } from '@module/cart/application/dto/cart.dto';
import { CartMapper } from '@module/cart/application/mapper/cart.mapper';
import { CartService } from '@module/cart/application/service/cart.service';
import { CART_STATUS } from '@module/cart/domain/cart-status';
import { Cart } from '@module/cart/domain/cart.entity';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { IGetOneOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class GetActiveCartUseCase {
  constructor(
    private readonly cartService: CartService,
    private readonly cartMapper: CartMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(userId: string): Promise<OneSerializedResponseDto<CartDto>> {
    const options: IGetOneOptions<Cart> = {
      filter: { status: CART_STATUS.ACTIVE },
      relations: ['items', 'items.product'],
    };

    const cart = await this.cartService.getCartByUserId(userId, options);

    return this.responseAdapter.oneEntityResponse(
      Cart.getEntityName(),
      this.cartMapper.fromEntity<CartDto>(cart),
      {
        items: { product: true },
      },
    );
  }
}
