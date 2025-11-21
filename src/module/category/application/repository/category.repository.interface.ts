import { Category } from '@module/category/domain/category.entity';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const CATEGORY_REPOSITORY_KEY = 'category_repository';

export interface ICategoryRepository extends BaseRepository<Category> {
  getCategoriesByIds(categoryIds: string[]): Promise<Category[] | []>;
}
