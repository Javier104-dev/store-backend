import { Product } from '@module/product/domain/product.entity';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const PRODUCT_REPOSITORY_KEY = 'product_repository';

export interface IProductRepository extends BaseRepository<Product> {}
