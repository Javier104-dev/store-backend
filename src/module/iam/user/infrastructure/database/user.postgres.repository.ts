import { IUserRepository } from '@module/iam/user/application/repository/user.repository.interface';
import { User } from '@module/iam/user/domain/user.entity';
import { UserSchema } from '@module/iam/user/infrastructure/database/user.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, In, Repository } from 'typeorm';

import { ICollection } from '@common/base/application/dto/collection.interface';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

export class UserPostgresRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<User>,
  ) {}

  async getAll(options: IGetAllOptions<User>): Promise<ICollection<User>> {
    const { filter, page, sort, fields } = options || {};

    const [items, itemCount] = await this.repository.findAndCount({
      where: { ...filter, roles: filter.roles && In(filter.roles) },
      order: sort,
      select: fields as FindOptionsSelect<User>,
      take: page.size,
      skip: page.offset,
    });

    return {
      data: items,
      pageNumber: page.number,
      pageSize: page.size,
      pageCount: Math.ceil(itemCount / page.size),
      itemCount,
    };
  }

  async getOneByUsername(username: string): Promise<User> {
    return this.repository.findOne({
      where: { username },
    });
  }

  async getOneByExternalId(externalId: string): Promise<User> {
    return this.repository.findOne({
      where: { externalId },
    });
  }

  async getOneByUsernameOrFail(username: string) {
    return await this.repository.findOne({
      where: { username },
    });
  }

  async saveOne(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async updateOneOrFail(
    id: string,
    updates: Partial<Omit<User, 'id'>>,
  ): Promise<User> {
    await this.repository.update({ id }, updates);
    return this.repository.findOne({ where: { id } });
  }

  async countUsers(): Promise<number> {
    return await this.repository.count();
  }

  async getUserById(id: string): Promise<User> {
    return await this.repository.findOne({
      where: { id },
    });
  }
}
