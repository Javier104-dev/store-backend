import { CategoryDto } from '@module/category/application/dto/category.dto';
import {
  CATEGORY_REPOSITORY_KEY,
  ICategoryRepository,
} from '@module/category/application/repository/category.repository.interface';
import { Category } from '@module/category/domain/category.entity';
import { Inject, Injectable } from '@nestjs/common';

import { ICollection } from '@common/base/application/dto/collection.interface';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY_KEY)
    private readonly repository: ICategoryRepository,
  ) {}

  async getCategoriesByIds(categoryIds: string[]): Promise<Category[]> {
    return this.repository.getCategoriesByIds(categoryIds);
  }

  async getCategoryCollection(
    options: IGetAllOptions<Category>,
  ): Promise<ICollection<CategoryDto>> {
    return this.repository.getAll(options);
  }
}
