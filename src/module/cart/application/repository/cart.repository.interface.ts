import { Cart } from '@module/cart/domain/cart.entity';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const CART_REPOSITORY_KEY = 'cart_repository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICartRepository extends BaseRepository<Cart> {}
