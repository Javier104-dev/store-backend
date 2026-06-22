import { ProductDto } from '@module/product/application/dto/product.dto';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import {
  IProductRepository,
  PRODUCT_REPOSITORY_KEY,
} from '@module/product/application/repository/product.repository.interface';
import { Product } from '@module/product/domain/product.entity';
import { UploadDto } from '@module/upload/application/dto/upload.dto';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { ICollection } from '@common/base/application/dto/collection.interface';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import {
  IGetAllOptions,
  IGetOneOptions,
} from '@common/base/get-all-options.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_KEY)
    private readonly repository: IProductRepository,
    private readonly productMapper: ProductMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async getProductByIdOrFail(productId: string): Promise<Product> {
    return this.repository.findOneByIdOrFail(productId);
  }

  async getAllProductsByStore(
    storeId: string,
    options?: IGetAllOptions<Product>,
    relationsOptions?: IGetOneOptions<Product>,
  ): Promise<ICollection<Product>> {
    const fullOptions = {
      ...options,
      filter: {
        ...options?.filter,
        store: { id: storeId },
      },
    };
    return this.repository.getAll(fullOptions, relationsOptions);
  }

  async getAllProducts(
    options?: IGetAllOptions<Product>,
    relationsOptions?: IGetOneOptions<Product>,
  ): Promise<ICollection<Product>> {
    return this.repository.getAll(options, relationsOptions);
  }

  async getProductCollectionByCategoryId(
    categoryId: string,
    options: IGetAllOptions<Product>,
  ): Promise<ICollection<Product>> {
    const relationsOptions: IGetOneOptions<Product> = {
      relations: ['upload'],
    };
    const fullOptions = {
      ...options,
      filter: {
        ...options.filter,
        categories: { id: categoryId },
      },
    };
    return this.repository.getAll(fullOptions, relationsOptions);
  }

  async findOneByIdOrFail(
    id: string,
    options?: IGetOneOptions<Product>,
    transformIncluded?: Record<string, (rel: UploadDto) => UploadDto>,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const entity = await this.findRawOneByIdOrFail(id, options);

    return this.responseAdapter.oneEntityResponse(
      Product.getEntityName(),
      this.productMapper.fromEntity<ProductDto>(entity),
      this.buildRelationsObject(options),
      transformIncluded,
    );
  }

  async findRawOneByIdOrFail(
    id: string,
    options?: IGetOneOptions<Product>,
  ): Promise<Product> {
    return this.repository.findOneByIdOrFail(id, options);
  }

  async saveRawOne(entity: Product): Promise<Product> {
    return this.repository.saveOne(entity);
  }

  buildRelationsObject(
    relationsOptions: IGetOneOptions<Product>,
  ): Partial<Record<keyof Product, true>> {
    return Object.fromEntries(
      (relationsOptions?.relations ?? []).map((key) => [key, true as const]),
    );
  }
}
