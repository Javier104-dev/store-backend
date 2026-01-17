import { CategoryDto } from '@module/category/application/dto/category.dto';
import { CreateCategoryDto } from '@module/category/application/dto/create-category.dto';
import { UpdateCategoryDto } from '@module/category/application/dto/update-category.dto';
import { CategoryMapper } from '@module/category/application/mapper/category.mapper';
import {
  CATEGORY_REPOSITORY_KEY,
  ICategoryRepository,
} from '@module/category/application/repository/category.repository.interface';
import { Category } from '@module/category/domain/category.entity';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { ICollection } from '@common/base/application/dto/collection.interface';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class CategoryCrudUseCase extends BaseCrudUseCase<
  Category,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(
    @Inject(CATEGORY_REPOSITORY_KEY)
    protected readonly repository: ICategoryRepository,
    categoryMapper: CategoryMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(
      repository,
      categoryMapper,
      responseAdapter,
      Category.getEntityName(),
    );
  }

  async getCategoriesByIds(categoryIds: string[]): Promise<Category[] | []> {
    return this.repository.getCategoriesByIds(categoryIds);
  }

  async getCategoryCollection(
    options: IGetAllOptions<Category>,
  ): Promise<ICollection<CategoryDto>> {
    return await this.repository.getAll(options);
  }
}
