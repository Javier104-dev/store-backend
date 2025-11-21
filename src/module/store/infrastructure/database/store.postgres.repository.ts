import { Store } from '@module/store/domain/store.entity';
import { StoreSchema } from '@module/store/infrastructure/database/store.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';
import EntityNotFoundException from '@common/base/infrastructure/database/exception/not-found.exception';
import { isEmptyObject } from '@common/base/infrastructure/database/utils/object.utils';

@Injectable()
export class StorePostgresRepository extends BaseRepository<Store> {
  constructor(
    @InjectRepository(StoreSchema)
    protected readonly repository: Repository<Store>,
  ) {
    super(repository);
  }

  async getStoreFromUserId(userId: string): Promise<Store | null> {
    return this.repository.findOne({
      where: { owner: { id: userId } },
    });
  }

  async getStoreFromUserIdOrFail(userId: string): Promise<Store> {
    const entity = await this.getStoreFromUserId(userId);

    if (!entity || isEmptyObject(entity)) {
      throw new EntityNotFoundException(userId);
    }

    return entity;
  }
}
