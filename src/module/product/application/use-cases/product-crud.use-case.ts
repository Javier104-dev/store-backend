import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import {
  IProductRepository,
  PRODUCT_REPOSITORY_KEY,
} from '@module/product/application/repository/product.repository.interface';
import { Product } from '@module/product/domain/product.entity';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { ICollection } from '@common/base/application/dto/collection.interface';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class ProductCrudUseCase extends BaseCrudUseCase<
  Product,
  ProductDto,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_KEY)
    protected readonly repository: IProductRepository,
    private readonly productMapper: ProductMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, productMapper, responseAdapter, Product.getEntityName());
  }

  async getAllProductsByCategoryId(
    categoryId: string,
    options: IGetAllOptions<Product>,
  ): Promise<ManySerializedResponseDto<ProductDto>> {
    const collection = await this.getProductCollectionByCategoryId(
      categoryId,
      options,
    );
    const collectionDto = new CollectionDto({
      ...collection,
      data: collection.data.map((entity) =>
        this.productMapper.fromEntity<ProductDto>(entity),
      ),
    });

    return this.responseAdapter.manyEntitiesResponse(
      this.entityName,
      collectionDto,
    );
  }

  async getProductCollectionByCategoryId(
    categoryId: string,
    options: IGetAllOptions<Product>,
  ): Promise<ICollection<ProductDto>> {
    return await this.repository.getAllProductsByCategoryId(
      categoryId,
      options,
    );
  }

  async getOneWithRelationsOrFail(
    id: string,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const entity = await this.repository.getOneWithRelationsOrFail(id);
    return this.responseAdapter.oneEntityResponse(
      this.entityName,
      this.productMapper.fromEntity<ProductDto>(entity),
      ['categories'],
    );
  }
}
