import { CatalogService } from '@module/catalog/application/service/catalog.service';
import { CategoryDto } from '@module/category/application/dto/category.dto';
import { CategoryMapper } from '@module/category/application/mapper/category.mapper';
import { CategoryService } from '@module/category/application/service/category.service';
import { Category } from '@module/category/domain/category.entity';
import { UploadService } from '@module/upload/application/service/upload.service';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import {
  IGetAllOptions,
  PageOptions,
} from '@common/base/get-all-options.interface';

@Injectable()
export class GetAllCategoriesWithProductsUseCase {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly categoryService: CategoryService,
    private readonly uploadService: UploadService,
    private readonly categoryMapper: CategoryMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(
    productPageOptions: PageOptions,
    options?: IGetAllOptions<Category>,
  ): Promise<ManySerializedResponseDto<CategoryDto>> {
    const productPage = { page: productPageOptions };
    const collection =
      await this.categoryService.getCategoryCollection(options);

    const categoriesWithProducts =
      await this.catalogService.getCategoriesWithProducts(
        collection,
        productPage,
      );

    const collectionDto = new CollectionDto({
      ...collection,
      data: categoriesWithProducts.map((entity) =>
        this.categoryMapper.fromEntity<CategoryDto>(entity),
      ),
    });

    return this.responseAdapter.manyEntitiesResponse(
      Category.getEntityName(),
      collectionDto,
      {
        products: {
          upload: true,
        },
      },
      this.uploadService.transformUploadIncluded(),
    );
  }
}
