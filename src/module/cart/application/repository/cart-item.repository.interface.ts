import { CartItem } from '@module/cart/domain/cart-item.entity';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const CART_ITEM_REPOSITORY_KEY = 'cart_item_repository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICartItemRepository extends BaseRepository<CartItem> {}
