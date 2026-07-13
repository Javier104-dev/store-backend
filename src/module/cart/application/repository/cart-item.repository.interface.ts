import { CartItem } from '@module/cart/domain/cart-item.entity';

import { IGetOneOptions } from '@common/base/get-all-options.interface';
import IRepository from '@common/base/infrastructure/database/repository.interface';

export const CART_ITEM_REPOSITORY_KEY = 'cart_item_repository';

export interface ICartItemRepository extends IRepository<CartItem> {
  getCartItem(options?: IGetOneOptions<CartItem>): Promise<CartItem>;
}
