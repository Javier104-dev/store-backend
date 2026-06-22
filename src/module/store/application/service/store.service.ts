import { User } from '@module/iam/user/domain/user.entity';
import { CreateStoreDto } from '@module/store/application/dto/create-store.dto';
import { UpdateStoreDto } from '@module/store/application/dto/upate-store.dto';
import { StoreMapper } from '@module/store/application/mapper/store.mapper';
import {
  IStoreRepository,
  STORE_REPOSITORY_KEY,
} from '@module/store/application/repository/store.repository.interface';
import { Store } from '@module/store/domain/store.entity';
import { StoreNotFoundException } from '@module/store/infrastructure/exception/store-not-found.exception';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class StoreService {
  constructor(
    @Inject(STORE_REPOSITORY_KEY)
    protected readonly repository: IStoreRepository,
    protected readonly storeMapper: StoreMapper,
  ) {}

  async createStore(createDto: CreateStoreDto, user: User): Promise<Store> {
    const store = this.storeMapper.toEntity<Store>({
      ...createDto,
      owner: user,
    });
    return this.repository.saveOne(store);
  }

  async updateStoreOrFail(
    userId: string,
    updateDto: UpdateStoreDto,
  ): Promise<Store> {
    const store = await this.getStoreFromUserIdOrFail(userId);
    return this.repository.updateOneOrFail(
      store.id,
      this.storeMapper.toEntity<Store>(updateDto),
    );
  }

  async getStoreFromUserIdOrFail(userId: string): Promise<Store> {
    const store = await this.repository.getStoreFromUserId(userId);

    if (!store) {
      throw new StoreNotFoundException({
        message: `This user doesn't have a store yet`,
      });
    }

    return store;
  }
}
