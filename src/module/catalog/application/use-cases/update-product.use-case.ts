import { CatalogService } from '@module/catalog/application/service/catalog.service';
import { User } from '@module/iam/user/domain/user.entity';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { ProductService } from '@module/product/application/service/product.service';
import { Product } from '@module/product/domain/product.entity';
import { StoreService } from '@module/store/application/service/store.service';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { IGetOneOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
    private readonly catalogService: CatalogService,
    private readonly productMapper: ProductMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(
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

    const { upload, ...productWithoutUpload } =
      await this.productService.findRawOneByIdOrFail(id, options);

    await this.catalogService.updateProductFiles(
      upload,
      productWithoutUpload,
      uploadIds,
      files,
    );

    const categories = await this.catalogService.resolveCategories(categoryIds);

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
}
