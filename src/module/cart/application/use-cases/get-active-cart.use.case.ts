import { CartDto } from '@module/cart/application/dto/cart.dto';
import { CartMapper } from '@module/cart/application/mapper/cart.mapper';
import { CartService } from '@module/cart/application/service/cart.service';
import { Cart } from '@module/cart/domain/cart.entity';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';

@Injectable()
export class GetActiveCartUseCase {
  constructor(
    private readonly cartService: CartService,
    private readonly cartMapper: CartMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(userId: string): Promise<OneSerializedResponseDto<CartDto>> {
    const cart = await this.cartService.getCartByUserId(userId);
    return this.responseAdapter.oneEntityResponse(
      Cart.getEntityName(),
      this.cartMapper.fromEntity<CartDto>(cart),
      {
        items: { product: true },
      },
    );
  }
}
