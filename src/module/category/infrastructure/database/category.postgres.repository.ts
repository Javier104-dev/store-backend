import { Category } from '@module/category/domain/category.entity';
import { CategorySchema } from '@module/category/infrastructure/database/category.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class CategoryPostgresRepository extends BaseRepository<Category> {
  constructor(
    @InjectRepository(CategorySchema)
    protected readonly repository: Repository<Category>,
  ) {
    super(repository);
  }

  async getCategoriesByIds(categoryIds: string[]): Promise<Category[] | []> {
    return this.repository.findBy({ id: In(categoryIds) });
  }
}
