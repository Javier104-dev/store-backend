import { Product } from '@module/product/domain/product.entity';

import { ICollection } from '@common/base/application/dto/collection.interface';
import {
  IGetAllOptions,
  IGetOneOptions,
} from '@common/base/get-all-options.interface';
import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const PRODUCT_REPOSITORY_KEY = 'product_repository';

export interface IProductRepository extends BaseRepository<Product> {
  getAll(
    options: IGetAllOptions<Product>,
    relationsOptions?: Omit<IGetOneOptions<Product>, 'filter'>,
  ): Promise<ICollection<Product>>;
  findOneByIdOrFail(
    id: string,
    options?: IGetOneOptions<Product>,
  ): Promise<Product>;
}
