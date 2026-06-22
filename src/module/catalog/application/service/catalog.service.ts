import { CategoryService } from '@module/category/application/service/category.service';
import { Category } from '@module/category/domain/category.entity';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { ProductService } from '@module/product/application/service/product.service';
import { PRODUCT_UPLOAD_FOLDER } from '@module/product/domain/product.constants';
import { Product } from '@module/product/domain/product.entity';
import { UploadService } from '@module/upload/application/service/upload.service';
import { Upload } from '@module/upload/domain/upload.entity';
import { Injectable } from '@nestjs/common';

import { ICollection } from '@common/base/application/dto/collection.interface';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class CatalogService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly uploadService: UploadService,
    private readonly productMapper: ProductMapper,
  ) {}

  async getCategoriesWithProducts(
    categoryCollection: ICollection<Category>,
    options: IGetAllOptions<Product>,
  ): Promise<Category[]> {
    return await Promise.all(
      categoryCollection.data.map(async (category) => {
        const productCollection =
          await this.productService.getProductCollectionByCategoryId(
            category.id,
            options,
          );
        return {
          ...category,
          products: productCollection.data,
        };
      }),
    );
  }

  async uploadProductFiles(
    files: Express.Multer.File[],
    productCreated: Product,
  ): Promise<Upload[]> {
    if (!files?.length) {
      return;
    }

    return this.uploadService.uploadFiles(
      files,
      PRODUCT_UPLOAD_FOLDER,
      this.productMapper.fromEntity<Product>(productCreated, {
        exclude: ['categoryIds', 'store', 'categories'],
      }),
    );
  }

  async updateProductFiles(
    upload: Upload[],
    productWithoutUpload: Product,
    uploadIds: string[],
    files: Express.Multer.File[],
  ): Promise<void> {
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
        productWithoutUpload,
      );
    }
  }

  async resolveCategories(categoryIds?: string[]): Promise<Category[]> {
    if (!categoryIds?.length) {
      return [];
    }
    return this.categoryService.getCategoriesByIds(categoryIds);
  }
}
