import { CartItem } from '@module/cart/domain/cart-item.entity';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const CART_ITEM_REPOSITORY_KEY = 'cart_item_repository';

export interface ICartItemRepository extends BaseRepository<CartItem> {
  getActiveCartItemByUser(
    cartItemId: string,
    userId: string,
  ): Promise<CartItem>;
}
