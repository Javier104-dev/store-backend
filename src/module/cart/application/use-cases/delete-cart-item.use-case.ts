import { CartItemService } from '@module/cart/application/service/cart-item.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteCartItemUseCase {
  constructor(private readonly cartItemService: CartItemService) {}

  async execute(userId: string, cartItemId: string): Promise<void> {
    await this.cartItemService.getActiveCartItemByUserIdOrFail(
      cartItemId,
      userId,
    );
    return this.cartItemService.deleteCartItem(cartItemId);
  }
}
