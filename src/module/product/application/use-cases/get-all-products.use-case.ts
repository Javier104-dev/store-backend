import { ProductDto } from '@module/product/application/dto/product.dto';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { ProductService } from '@module/product/application/service/product.service';
import { Product } from '@module/product/domain/product.entity';
import { UploadService } from '@module/upload/application/service/upload.service';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import {
  IGetAllOptions,
  IGetOneOptions,
} from '@common/base/get-all-options.interface';

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
    private readonly responseAdapter: BaseResponseAdapter,
    private readonly productMapper: ProductMapper,
  ) {}

  async execute(
    options?: IGetAllOptions<Product>,
  ): Promise<ManySerializedResponseDto<ProductDto>> {
    const relationsOptions: IGetOneOptions<Product> = {
      relations: ['upload'],
    };

    const collection = await this.productService.getAllProducts(
      options,
      relationsOptions,
    );

    const collectionDto = new CollectionDto({
      ...collection,
      data: collection.data.map((entity) =>
        this.productMapper.fromEntity<ProductDto>(entity),
      ),
    });

    return this.responseAdapter.manyEntitiesResponse(
      Product.getEntityName(),
      collectionDto,
      this.productService.buildRelationsObject(relationsOptions),
      this.uploadService.transformUploadIncluded(),
    );
  }
}
