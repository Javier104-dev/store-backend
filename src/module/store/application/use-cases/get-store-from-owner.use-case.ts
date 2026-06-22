import { StoreDto } from '@module/store/application/dto/store.dto';
import { StoreMapper } from '@module/store/application/mapper/store.mapper';
import { StoreService } from '@module/store/application/service/store.service';
import { Store } from '@module/store/domain/store.entity';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';

@Injectable()
export class GetStoreFromOwnerUseCase {
  constructor(
    protected readonly storeService: StoreService,
    protected readonly storeMapper: StoreMapper,
    protected readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(userId: string): Promise<OneSerializedResponseDto<StoreDto>> {
    const store = await this.storeService.getStoreFromUserIdOrFail(userId);
    return this.responseAdapter.oneEntityResponse<StoreDto>(
      Store.getEntityName(),
      this.storeMapper.fromEntity<StoreDto>(store),
    );
  }
}
