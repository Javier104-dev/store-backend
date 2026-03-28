import { CategoryDto } from '@module/category/application/dto/category.dto';
import { CategoryMapper } from '@module/category/application/mapper/category.mapper';
import { CategoryCrudUseCase } from '@module/category/application/use-cases/category-crud.use-case';
import { Category } from '@module/category/domain/category.entity';
import { User } from '@module/iam/user/domain/user.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { ProductCrudUseCase } from '@module/product/application/use-cases/product-crud.use-case';
import { Product } from '@module/product/domain/product.entity';
import { StoreCrudUseCase } from '@module/store/application/use-cases/store-crud.use-case';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import {
  IGetAllOptions,
  IGetOneOptions,
  PageOptions,
} from '@common/base/get-all-options.interface';

@Injectable()
export class CatalogCrudUseCase {
  constructor(
    private readonly storeCrudUseCase: StoreCrudUseCase,
    private readonly productCrudUseCase: ProductCrudUseCase,
    private readonly categoryCrudUseCase: CategoryCrudUseCase,
    private readonly productMapper: ProductMapper,
    private readonly categoryMapper: CategoryMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async getAllCategoriesWithProducts(
    productPageOptions: PageOptions,
    options?: IGetAllOptions<Category>,
  ): Promise<ManySerializedResponseDto<CategoryDto>> {
    const productPage = { page: productPageOptions };
    const collection =
      await this.categoryCrudUseCase.getCategoryCollection(options);

    const categoriesWithProducts = await Promise.all(
      collection.data.map(async (category) => {
        const productCollection =
          await this.productCrudUseCase.getProductCollectionByCategoryId(
            category.id,
            productPage,
          );

        return {
          ...category,
          products: productCollection.data,
        };
      }),
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
      ['products'],
    );
  }

  async saveOneProduct(
    createDto: CreateProductDto,
    user: User,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const { categoryIds } = createDto;

    const store = await this.storeCrudUseCase.getStoreFromUserIdOrFail(user.id);
    const categories = await this.resolveCategories(categoryIds);

    const product = this.productMapper.toEntity<Product>({
      ...createDto,
      store,
      categories,
    });

    const productCreated = await this.productCrudUseCase.saveRawOne(product);

    return this.responseAdapter.oneEntityResponse<ProductDto>(
      Product.getEntityName(),
      this.productMapper.fromEntity<ProductDto>(productCreated, {
        exclude: ['categoryIds'],
      }),
      ['store', 'categories'],
    );
  }

  async updateOneOrFail(
    id: string,
    updateDto: UpdateProductDto,
    user: User,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const { categoryIds } = updateDto;

    const store = await this.storeCrudUseCase.getStoreFromUserIdOrFail(user.id);

    const options: IGetOneOptions<Product> = {
      filter: { store: { id: store.id } },
    };

    const product = await this.productCrudUseCase.findRawOneByIdOrFail(
      id,
      options,
    );

    const categories = await this.resolveCategories(categoryIds);

    const productToUpdate = this.productMapper.toEntity<Product>({
      ...product,
      ...updateDto,
      categories,
    });

    const productUpdated =
      await this.productCrudUseCase.saveRawOne(productToUpdate);

    return this.responseAdapter.oneEntityResponse<ProductDto>(
      Product.getEntityName(),
      this.productMapper.fromEntity<ProductDto>(productUpdated, {
        exclude: ['categories', 'categoryIds'],
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
