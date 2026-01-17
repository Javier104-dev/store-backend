import { Product } from '@module/product/domain/product.entity';

import { ICollection } from '@common/base/application/dto/collection.interface';
import { IGetAllOptions } from '@common/base/get-all-options.interface';
import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const PRODUCT_REPOSITORY_KEY = 'product_repository';

export interface IProductRepository extends BaseRepository<Product> {
  getAllProductsByCategoryId(
    categoryId: string,
    options: IGetAllOptions<Product>,
  ): Promise<ICollection<Product>>;
  getOneWithRelationsOrFail(id: string): Promise<Product>;
}
