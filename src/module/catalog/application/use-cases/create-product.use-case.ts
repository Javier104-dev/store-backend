import { CatalogService } from '@module/catalog/application/service/catalog.service';
import { User } from '@module/iam/user/domain/user.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { ProductService } from '@module/product/application/service/product.service';
import { Product } from '@module/product/domain/product.entity';
import { StoreService } from '@module/store/application/service/store.service';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
    private readonly productMapper: ProductMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(
    createDto: CreateProductDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const { categoryIds } = createDto;
    const store = await this.storeService.getStoreFromUserIdOrFail(user.id);
    const categories = await this.catalogService.resolveCategories(categoryIds);

    const product = this.productMapper.toEntity<Product>({
      ...createDto,
      store,
      categories,
    });

    const productCreated = await this.productService.saveRawOne(product);

    await this.catalogService.uploadProductFiles(files, productCreated);

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
}
