import {
  CART_ITEM_REPOSITORY_KEY,
  ICartItemRepository,
} from '@module/cart/application/repository/cart-item.repository.interface';
import { CartItem } from '@module/cart/domain/cart-item.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CartItemService {
  constructor(
    @Inject(CART_ITEM_REPOSITORY_KEY)
    private readonly repository: ICartItemRepository,
  ) {}

  async saveManyItems(items: CartItem[]): Promise<CartItem[]> {
    return this.repository.saveMany(items);
  }
}
