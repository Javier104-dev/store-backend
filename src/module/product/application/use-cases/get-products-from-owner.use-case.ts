import { User } from '@module/iam/user/domain/user.entity';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { ProductService } from '@module/product/application/service/product.service';
import { Product } from '@module/product/domain/product.entity';
import { StoreService } from '@module/store/application/service/store.service';
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
export class GetProductsFromOwnerUseCase {
  constructor(
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
    private readonly productMapper: ProductMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(
    user: User,
    options: IGetAllOptions<Product>,
  ): Promise<ManySerializedResponseDto<ProductDto>> {
    const store = await this.storeService.getStoreFromUserIdOrFail(user.id);

    const relationsOptions: IGetOneOptions<Product> = {
      relations: ['upload'],
    };

    const productFromStore = await this.productService.getAllProductsByStore(
      store.id,
      options,
      relationsOptions,
    );

    const collectionDto = new CollectionDto({
      ...productFromStore,
      data: productFromStore.data.map((entity) =>
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
