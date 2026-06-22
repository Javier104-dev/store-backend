import { User } from '@module/iam/user/domain/user.entity';

import { ICollection } from '@common/base/application/dto/collection.interface';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

export const USER_REPOSITORY_KEY = 'user_repository';

export interface IUserRepository {
  getAll(options: IGetAllOptions<User>): Promise<ICollection<User>>;

  getOneByUsername(username: string): Promise<User>;

  getOneByExternalId(externalId: string): Promise<User>;

  getOneByUsernameOrFail(username: string): Promise<User>;

  saveOne(user: User): Promise<User>;

  updateOneOrFail(
    id: string,
    updates: Partial<Omit<User, 'id'>>,
  ): Promise<User>;

  countUsers(): Promise<number>;

  getUserById(id: string): Promise<User>;
}
