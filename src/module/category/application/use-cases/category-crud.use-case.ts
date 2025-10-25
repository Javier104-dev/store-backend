import { Category } from '@module/category/domain/category.entity';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';

import { CategoryDto } from '../dto/category.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import {
  CATEGORY_REPOSITORY_KEY,
  ICategoryRepository,
} from '../repository/category.repository.interface';

@Injectable()
export class CategoryCrudUseCase extends BaseCrudUseCase<
  Category,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(
    @Inject(CATEGORY_REPOSITORY_KEY)
    repository: ICategoryRepository,
    mapper: DtoMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, mapper, responseAdapter, Category.getEntityName());
  }
}
