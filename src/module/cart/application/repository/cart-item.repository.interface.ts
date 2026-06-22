import { CartItem } from '@module/cart/domain/cart-item.entity';

import IRepository from '@common/base/infrastructure/database/repository.interface';

export const CART_ITEM_REPOSITORY_KEY = 'cart_item_repository';

export interface ICartItemRepository extends IRepository<CartItem> {
  getActiveCartItemByUser(
    cartItemId: string,
    userId: string,
  ): Promise<CartItem>;
}
