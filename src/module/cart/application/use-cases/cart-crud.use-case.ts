import { CartDto } from '@module/cart/application/dto/cart.dto';
import { CreateCartDto } from '@module/cart/application/dto/create-cart.dto';
import { UpdateCartDto } from '@module/cart/application/dto/update-cart.dto';
import {
  CART_REPOSITORY_KEY,
  ICartRepository,
} from '@module/cart/application/repository/cart.repository.interface';
import { Cart } from '@module/cart/domain/cart.entity';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';

@Injectable()
export class CartCrudUseCase extends BaseCrudUseCase<
  Cart,
  CartDto,
  CreateCartDto,
  UpdateCartDto
> {
  constructor(
    @Inject(CART_REPOSITORY_KEY)
    repository: ICartRepository,
    mapper: DtoMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, mapper, responseAdapter, Cart.getEntityName());
  }
}
