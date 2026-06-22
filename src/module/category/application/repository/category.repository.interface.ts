import { Category } from '@module/category/domain/category.entity';

import IRepository from '@common/base/infrastructure/database/repository.interface';

export const CATEGORY_REPOSITORY_KEY = 'category_repository';

export interface ICategoryRepository extends IRepository<Category> {
  getCategoriesByIds(categoryIds: string[]): Promise<Category[]>;
}
