import { UserDto } from '@module/iam/user/application/dto/user.dto';
import { UserMapper } from '@module/iam/user/application/mapper/user.mapper';
import {
  IUserRepository,
  USER_REPOSITORY_KEY,
} from '@module/iam/user/application/repository/user.repository.interface';
import { User } from '@module/iam/user/domain/user.entity';
import { UserNotFoundException } from '@module/iam/user/infrastructure/database/exception/user-not-found.exception';
import { UsernameNotFoundException } from '@module/iam/user/infrastructure/database/exception/username-not-found.exception';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_KEY)
    private readonly repository: IUserRepository,
    private readonly mapper: UserMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async getAll(
    options: IGetAllOptions<UserDto>,
  ): Promise<ManySerializedResponseDto<UserDto>> {
    const collection = await this.repository.getAll(options);
    const collectionDto = new CollectionDto({
      ...collection,
      data: collection.data.map((user) =>
        this.mapper.fromEntity<UserDto>(user),
      ),
    });

    return this.responseAdapter.manyEntitiesResponse(
      User.getEntityName(),
      collectionDto,
    );
  }

  async getOneByUsername(username: string): Promise<UserDto> {
    const user = await this.repository.getOneByUsername(username);
    return this.mapper.fromEntity<UserDto>(user);
  }

  async getOneByUsernameOrFail(username: string): Promise<UserDto> {
    const user = await this.repository.getOneByUsernameOrFail(username);

    if (!user) {
      throw new UsernameNotFoundException({
        username,
      });
    }

    return this.mapper.fromEntity<UserDto>(user);
  }

  async getUsersCount(): Promise<number> {
    return await this.repository.countUsers();
  }

  async updateOneOrFail(
    id: string,
    updates: Partial<Omit<User, 'id'>>,
  ): Promise<UserDto> {
    const user = await this.repository.updateOneOrFail(id, updates);

    if (!user) {
      throw new UserNotFoundException({
        message: `User with ID ${id} not found`,
      });
    }

    return this.mapper.fromEntity<UserDto>(user);
  }

  async saveOne(user: User): Promise<UserDto> {
    const savedUser = await this.repository.saveOne(user);
    return this.mapper.fromEntity<UserDto>(savedUser);
  }

  async getUserByIdOrFail(id: string) {
    const user = await this.repository.getUserById(id);

    if (!user) {
      throw new UserNotFoundException({
        message: `User with ID ${id} not found`,
      });
    }

    return this.mapper.fromEntity<UserDto>(user);
  }
}
