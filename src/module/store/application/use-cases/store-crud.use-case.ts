import { User } from '@module/iam/user/domain/user.entity';
import { CreateStoreDto } from '@module/store/application/dto/create-store.dto';
import { StoreDto } from '@module/store/application/dto/store.dto';
import { UpdateStoreDto } from '@module/store/application/dto/upate-store.dto';
import { StoreMapper } from '@module/store/application/mapper/store.mapper';
import {
  IStoreRepository,
  STORE_REPOSITORY_KEY,
} from '@module/store/application/repository/store.repository.interface';
import { Store } from '@module/store/domain/store.entity';
import StoreNotFoundException from '@module/store/infrastructure/exception/store-not-found.exception';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
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
    protected readonly repository: IStoreRepository,
    private readonly storeMapper: StoreMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, storeMapper, responseAdapter, Store.getEntityName());
  }

  async createStore(
    createDto: CreateStoreDto,
    user: User,
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    const store = this.storeMapper.toEntity<Store>({
      ...createDto,
      owner: user,
    });
    const storeCreated = await this.repository.saveOne(store);

    return this.responseAdapter.oneEntityResponse<StoreDto>(
      this.entityName,
      this.storeMapper.fromEntity<StoreDto>(storeCreated, {
        exclude: ['owner'],
      }),
    );
  }

  async getStoreFronOwner(
    userId: string,
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    const store = await this.repository.getStoreFromUserId(userId);

    if (!store) {
      throw new StoreNotFoundException(`This user doesn't have a store yet.`);
    }

    return this.responseAdapter.oneEntityResponse<StoreDto>(
      this.entityName,
      this.storeMapper.fromEntity<StoreDto>(store),
    );
  }

  async getStoreFromUserIdOrFail(id: string): Promise<Store> {
    return this.repository.getStoreFromUserIdOrFail(id);
  }

  async updateStoreOrFail(updateDto: UpdateStoreDto, user: User) {
    const store = await this.repository.getStoreFromUserId(user.id);

    if (!store) {
      throw new StoreNotFoundException(`This user doesn't have a store yet.`);
    }

    const entity = await this.repository.updateOneOrFail(
      store.id,
      this.mapper.toEntity<Store>(updateDto),
    );
    return this.responseAdapter.oneEntityResponse<StoreDto>(
      this.entityName,
      this.mapper.fromEntity<StoreDto>(entity),
    );
  }
}
