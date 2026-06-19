import { Cart } from '@module/cart/domain/cart.entity';

import { IGetOneOptions } from '@common/base/get-all-options.interface';
import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const CART_REPOSITORY_KEY = 'cart_repository';

export interface ICartRepository extends BaseRepository<Cart> {
  getCartByUserId(
    userId: string,
    options?: IGetOneOptions<Cart>,
  ): Promise<Cart>;
  getOne(options: IGetOneOptions<Cart>): Promise<Cart>;
}
