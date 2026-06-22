import { CreateStoreDto } from '@module/store/application/dto/create-store.dto';
import { StoreDto } from '@module/store/application/dto/store.dto';
import { UpdateStoreDto } from '@module/store/application/dto/upate-store.dto';
import {
  IStoreRepository,
  STORE_REPOSITORY_KEY,
} from '@module/store/application/repository/store.repository.interface';
import { Store } from '@module/store/domain/store.entity';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';

@Injectable()
export class StoreCrudUseCase extends BaseCrudUseCase<
  Store,
  StoreDto,
  CreateStoreDto,
  UpdateStoreDto
> {
  constructor(
    @Inject(STORE_REPOSITORY_KEY)
    repository: IStoreRepository,
    mapper: DtoMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, mapper, responseAdapter, Store.getEntityName());
  }
}
