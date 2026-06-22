import {
  IStoreRepository,
  STORE_REPOSITORY_KEY,
} from '@module/store/application/repository/store.repository.interface';
import { Store } from '@module/store/domain/store.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class StoreService {
  constructor(
    @Inject(STORE_REPOSITORY_KEY)
    protected readonly repository: IStoreRepository,
  ) {}

  async getStoreFromUserIdOrFail(id: string): Promise<Store> {
    return this.repository.getStoreFromUserIdOrFail(id);
  }
}
