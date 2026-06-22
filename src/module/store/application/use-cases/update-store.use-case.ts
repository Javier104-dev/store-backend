import { StoreDto } from '@module/store/application/dto/store.dto';
import { UpdateStoreDto } from '@module/store/application/dto/upate-store.dto';
import { StoreMapper } from '@module/store/application/mapper/store.mapper';
import { StoreService } from '@module/store/application/service/store.service';
import { Store } from '@module/store/domain/store.entity';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';

@Injectable()
export class UpdateStoreUseCase {
  constructor(
    protected readonly storeService: StoreService,
    protected readonly storeMapper: StoreMapper,
    protected readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(userId: string, updateDto: UpdateStoreDto) {
    const storeUpdated = await this.storeService.updateStoreOrFail(
      userId,
      updateDto,
    );
    return this.responseAdapter.oneEntityResponse<StoreDto>(
      Store.getEntityName(),
      this.storeMapper.fromEntity<StoreDto>(storeUpdated),
    );
  }
}
