import { Store } from '@module/store/domain/store.entity';

import IRepository from '@common/base/infrastructure/database/repository.interface';

export const STORE_REPOSITORY_KEY = 'store_repository';

export interface IStoreRepository extends IRepository<Store> {
  getStoreFromUserId(userId: string): Promise<Store | null>;
  getStoreFromUserIdOrFail(userId: string): Promise<Store>;
}
