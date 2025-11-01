import { Category } from '@module/category/domain/category.entity';
import { ProductCrudUseCase } from '@module/product/application/use-cases/product-crud.use-case';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

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
    private readonly productCrudUseCase: ProductCrudUseCase,
  ) {
    super(repository, mapper, responseAdapter, Category.getEntityName());
  }

  async getAllCategoriesWithProducts(
    productsLimit: number,
    options?: IGetAllOptions<Category>,
  ): Promise<ManySerializedResponseDto<CategoryDto>> {
    const productOptions = { page: { size: productsLimit } };

    const { data: categories, ...rest } = await this.repository.getAll(options);

    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const collectionProduct =
          await this.productCrudUseCase.getAllProductsByCategoryId(
            category.id,
            productOptions,
          );

        return {
          ...category,
          products: collectionProduct.data,
        };
      }),
    );

    const collectionCategoriesWithProducts = {
      data: categoriesWithProducts,
      ...rest,
    };

    const collectionDto = new CollectionDto({
      ...collectionCategoriesWithProducts,
      data: collectionCategoriesWithProducts.data.map((entity) =>
        this.mapper.fromEntity<CategoryDto>(entity),
      ),
    });

    return this.responseAdapter.manyEntitiesResponse(
      this.entityName,
      collectionDto,
    );
  }
}
