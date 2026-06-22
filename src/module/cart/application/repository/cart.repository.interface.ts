import { Cart } from '@module/cart/domain/cart.entity';

import { IGetOneOptions } from '@common/base/get-all-options.interface';
import IRepository from '@common/base/infrastructure/database/repository.interface';

export const CART_REPOSITORY_KEY = 'cart_repository';

export interface ICartRepository extends IRepository<Cart> {
  getCartByUserId(
    userId: string,
    options?: IGetOneOptions<Cart>,
  ): Promise<Cart>;
  getOne(options: IGetOneOptions<Cart>): Promise<Cart>;
}
