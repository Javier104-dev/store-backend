import { CatalogMapper } from '@module/catalog/application/mapper/catalog.mapper';
import { CategoryDto } from '@module/category/application/dto/category.dto';
import { CategoryCrudUseCase } from '@module/category/application/use-cases/category-crud.use-case';
import { Category } from '@module/category/domain/category.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { ProductCrudUseCase } from '@module/product/application/use-cases/product-crud.use-case';
import { Product } from '@module/product/domain/product.entity';
import { StoreCrudUseCase } from '@module/store/application/use-cases/store-crud.use-case';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class CatalogCrudUseCase {
  constructor(
    private readonly storeCrudUseCase: StoreCrudUseCase,
    private readonly productCrudUseCase: ProductCrudUseCase,
    private readonly categoryCrudUseCase: CategoryCrudUseCase,
    private readonly catalogMapper: CatalogMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async getAllCategoriesWithProducts(
    productsLimit: number,
    options?: IGetAllOptions<Category>,
  ): Promise<ManySerializedResponseDto<CategoryDto>> {
    const productOptions = { page: { size: productsLimit } };
    const collection = await this.categoryCrudUseCase.getAll(options);

    const categoriesWithProducts = await Promise.all(
      collection.data.map(async (category) => {
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

    return {
      ...collection,
      data: categoriesWithProducts,
    };
  }

  async saveOneProduct(
    createDto: CreateProductDto,
    userId: string,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const { categoryIds } = createDto;

    const store = await this.storeCrudUseCase.getStoreFromUserIdOrFail(userId);
    const categories = await this.resolveCategories(categoryIds);

    const product = await this.productCrudUseCase.saveOneRaw({
      ...createDto,
      store,
      categories,
    });

    return this.responseAdapter.oneEntityResponse<ProductDto>(
      Product.getEntityName(),
      this.catalogMapper.fromEntity<ProductDto>(product, {
        exclude: ['categoryIds'],
      }),
      ['store', 'categories'],
    );
  }

  async updateOneOrFail(
    id: string,
    updateDto: UpdateProductDto,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const { categoryIds } = updateDto;

    const categories = await this.resolveCategories(categoryIds);
    const product = await this.productCrudUseCase.updateOneOrFailRaw(id, {
      ...updateDto,
      categories,
    });

    return this.responseAdapter.oneEntityResponse<ProductDto>(
      Product.getEntityName(),
      this.catalogMapper.fromEntity<ProductDto>(product, {
        exclude: ['categories'],
      }),
    );
  }

  private async resolveCategories(categoryIds?: string[]): Promise<Category[]> {
    if (!categoryIds?.length) {
      return [];
    }
    return this.categoryCrudUseCase.getCategoriesByIds(categoryIds);
  }
}
