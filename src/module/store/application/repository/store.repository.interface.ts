import { Store } from '@module/store/domain/store.entity';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const STORE_REPOSITORY_KEY = 'store_repository';

export interface IStoreRepository extends BaseRepository<Store> {
  getStoreFromUserIdOrFail(userId: string): Promise<Store>;
}
