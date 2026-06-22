import { User } from '@module/iam/user/domain/user.entity';
import { CreateStoreDto } from '@module/store/application/dto/create-store.dto';
import { StoreDto } from '@module/store/application/dto/store.dto';
import { StoreMapper } from '@module/store/application/mapper/store.mapper';
import { StoreService } from '@module/store/application/service/store.service';
import { Store } from '@module/store/domain/store.entity';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';

@Injectable()
export class CreateStoreUseCase {
  constructor(
    protected readonly storeService: StoreService,
    protected readonly storeMapper: StoreMapper,
    protected readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(
    createDto: CreateStoreDto,
    user: User,
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    const storeCreated = await this.storeService.createStore(createDto, user);
    return this.responseAdapter.oneEntityResponse<StoreDto>(
      Store.getEntityName(),
      this.storeMapper.fromEntity<StoreDto>(storeCreated, {
        exclude: ['owner'],
      }),
    );
  }
}
