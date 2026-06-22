import { CartItemDto } from '@module/cart/application/dto/cart-item.dto';
import { UpdateCartItemDto } from '@module/cart/application/dto/update-cart-item.dto';
import { CartItemService } from '@module/cart/application/service/cart-item.service';
import { CartItem } from '@module/cart/domain/cart-item.entity';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';

@Injectable()
export class UpdateCartItemtUseCase {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(
    cartItemId: string,
    updateDto: UpdateCartItemDto,
    userId: string,
  ): Promise<OneSerializedResponseDto<CartItemDto>> {
    await this.cartItemService.getActiveCartItemByUserOrFail(
      cartItemId,
      userId,
    );
    const cartItemUpdated = await this.cartItemService.updateCartItem(
      cartItemId,
      updateDto,
    );
    return this.responseAdapter.oneEntityResponse<CartItemDto>(
      CartItem.getEntityName(),
      cartItemUpdated,
    );
  }
}
