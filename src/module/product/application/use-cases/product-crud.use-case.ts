import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

import { Product } from '../../domain/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductDto } from '../dto/product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  IProductRepository,
  PRODUCT_REPOSITORY_KEY,
} from '../repository/product.repository.interface';

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
    mapper: DtoMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, mapper, responseAdapter, Product.getEntityName());
  }

  async getAllProductsByCategoryId(
    categoryId: string,
    options: IGetAllOptions<Product>,
  ): Promise<ManySerializedResponseDto<ProductDto>> {
    const collection = await this.repository.getAllProductsByCategoryId(
      categoryId,
      options,
    );
    const collectionDto = new CollectionDto({
      ...collection,
      data: collection.data.map((entity) =>
        this.mapper.fromEntity<Product>(entity),
      ),
    });

    return this.responseAdapter.manyEntitiesResponse(
      this.entityName,
      collectionDto,
    );
  }
}
