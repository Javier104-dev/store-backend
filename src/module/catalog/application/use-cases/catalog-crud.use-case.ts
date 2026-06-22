import { CategoryDto } from '@module/category/application/dto/category.dto';
import { CategoryMapper } from '@module/category/application/mapper/category.mapper';
import { CategoryService } from '@module/category/application/service/category.service';
import { Category } from '@module/category/domain/category.entity';
import { User } from '@module/iam/user/domain/user.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { ProductService } from '@module/product/application/service/product.service';
import { PRODUCT_UPLOAD_FOLDER } from '@module/product/domain/product.constants';
import { Product } from '@module/product/domain/product.entity';
import { StoreService } from '@module/store/application/service/store.service';
import { UploadService } from '@module/upload/application/service/upload.service';
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
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly productMapper: ProductMapper,
    private readonly categoryMapper: CategoryMapper,
    private readonly responseAdapter: BaseResponseAdapter,
    private readonly uploadService: UploadService,
  ) {}

  async getAllCategoriesWithProducts(
    productPageOptions: PageOptions,
    options?: IGetAllOptions<Category>,
  ): Promise<ManySerializedResponseDto<CategoryDto>> {
    const productPage = { page: productPageOptions };
    const collection =
      await this.categoryService.getCategoryCollection(options);

    const categoriesWithProducts = await Promise.all(
      collection.data.map(async (category) => {
        const productCollection =
          await this.productService.getProductCollectionByCategoryId(
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
      {
        products: {
          upload: true,
        },
      },
      this.uploadService.transformUploadIncluded(),
    );
  }

  async saveOneProduct(
    createDto: CreateProductDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const { categoryIds } = createDto;

    const store = await this.storeService.getStoreFromUserIdOrFail(user.id);
    const categories = await this.resolveCategories(categoryIds);

    const product = this.productMapper.toEntity<Product>({
      ...createDto,
      store,
      categories,
    });

    const productCreated = await this.productService.saveRawOne(product);

    if (files?.length) {
      await this.uploadService.uploadFiles(
        files,
        PRODUCT_UPLOAD_FOLDER,
        this.productMapper.fromEntity<Product>(productCreated, {
          exclude: ['categoryIds', 'store', 'categories'],
        }),
      );
    }

    return this.responseAdapter.oneEntityResponse<ProductDto>(
      Product.getEntityName(),
      this.productMapper.fromEntity<ProductDto>(productCreated, {
        exclude: ['categoryIds'],
      }),
      {
        store: true,
        categories: true,
        upload: true,
      },
    );
  }

  async updateOneOrFail(
    id: string,
    updateDto: UpdateProductDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const { categoryIds, uploadIds } = updateDto;

    const store = await this.storeService.getStoreFromUserIdOrFail(user.id);

    const options: IGetOneOptions<Product> = {
      filter: { store: { id: store.id } },
      relations: ['upload'],
    };

    const product = await this.productService.findRawOneByIdOrFail(id, options);

    const { upload, ...productWithoutUpload } = product;

    const uploadIdsToKeep = uploadIds ?? [];

    const uploadsToDelete = upload.filter(
      (upload) => !uploadIdsToKeep.includes(upload.id),
    );

    if (uploadsToDelete.length) {
      await this.uploadService.deleteManyFiles(uploadsToDelete);
    }

    if (files?.length) {
      await this.uploadService.uploadFiles(
        files,
        PRODUCT_UPLOAD_FOLDER,
        this.productMapper.fromEntity<Product>(product, {
          exclude: ['upload'],
        }),
      );
    }

    const categories = await this.resolveCategories(categoryIds);

    const productToUpdate = this.productMapper.toEntity<Product>({
      ...productWithoutUpload,
      ...updateDto,
      categories,
    });

    const productUpdated =
      await this.productService.saveRawOne(productToUpdate);

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
    return this.categoryService.getCategoriesByIds(categoryIds);
  }
}
