import { Store } from '@module/store/domain/store.entity';
import { StoreSchema } from '@module/store/infrastructure/database/store.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class StorePostgresRepository extends BaseRepository<Store> {
  constructor(
    @InjectRepository(StoreSchema)
    protected readonly repository: Repository<Store>,
  ) {
    super(repository);
  }
}
