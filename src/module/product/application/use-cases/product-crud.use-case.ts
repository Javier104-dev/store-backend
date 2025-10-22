import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';

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
    repository: IProductRepository,
    mapper: DtoMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, mapper, responseAdapter, Product.getEntityName());
  }
}
