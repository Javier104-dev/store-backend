import { Category } from '@module/category/domain/category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

import { CategorySchema } from './category.schema';

@Injectable()
export class CategoryPostgresRepository extends BaseRepository<Category> {
  constructor(
    @InjectRepository(CategorySchema)
    protected readonly repository: Repository<Category>,
  ) {
    super(repository);
  }
}
