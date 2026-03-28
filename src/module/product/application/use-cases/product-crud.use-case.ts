import { User } from '@module/iam/user/domain/user.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import {
  IProductRepository,
  PRODUCT_REPOSITORY_KEY,
} from '@module/product/application/repository/product.repository.interface';
import { Product } from '@module/product/domain/product.entity';
import { StoreCrudUseCase } from '@module/store/application/use-cases/store-crud.use-case';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { ICollection } from '@common/base/application/dto/collection.interface';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';
import {
  IGetAllOptions,
  IGetOneOptions,
} from '@common/base/get-all-options.interface';

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
    private readonly storeCrudUseCase: StoreCrudUseCase,
    private readonly productMapper: ProductMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, productMapper, responseAdapter, Product.getEntityName());
  }

  async getProductCollectionByCategoryId(
    categoryId: string,
    options: IGetAllOptions<Product>,
  ): Promise<ICollection<ProductDto>> {
    const fullOptions = {
      ...options,
      filter: {
        ...options.filter,
        categories: { id: categoryId },
      },
    };

    return this.repository.getAll(fullOptions);
  }

  async findOneByOwnerOrFail(
    user: User,
    id: string,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const store = await this.storeCrudUseCase.getStoreFromUserIdOrFail(user.id);

    const options: IGetOneOptions<Product> = {
      filter: { store: { id: store.id } },
      relations: ['categories'],
    };

    return this.findOneByIdOrFail(id, options);
  }

  async getOneByIdOrFail(
    id: string,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const options: IGetOneOptions<Product> = {
      relations: ['categories'],
    };
    return this.findOneByIdOrFail(id, options);
  }

  async findOneByIdOrFail(
    id: string,
    options?: IGetOneOptions<Product>,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const entity = await this.findRawOneByIdOrFail(id, options);
    return this.responseAdapter.oneEntityResponse(
      this.entityName,
      this.productMapper.fromEntity<ProductDto>(entity),
      options?.relations,
    );
  }

  async findRawOneByIdOrFail(
    id: string,
    options?: IGetOneOptions<Product>,
  ): Promise<Product> {
    return this.repository.findOneByIdOrFail(id, options);
  }

  async getProductsFromOwner(
    user: User,
    options: IGetAllOptions<Product>,
  ): Promise<ManySerializedResponseDto<ProductDto>> {
    const store = await this.storeCrudUseCase.getStoreFromUserIdOrFail(user.id);

    const fullOptions = {
      ...options,
      filter: {
        ...options.filter,
        store: { id: store.id },
      },
    };

    const productFromStore = await this.repository.getAll(fullOptions);

    const collectionDto = new CollectionDto({
      ...productFromStore,
      data: productFromStore.data.map((entity) =>
        this.mapper.fromEntity<ProductDto>(entity),
      ),
    });

    return this.responseAdapter.manyEntitiesResponse(
      this.entityName,
      collectionDto,
    );
  }
}
