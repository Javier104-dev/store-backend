import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

import { Author } from '@/module/author/domain/author.entity';
import { AuthorSchema } from '@/module/author/infrastructure/database/author.schema';

@Injectable()
export class AuthorPostgresRepository extends BaseRepository<Author> {
  constructor(
    @InjectRepository(AuthorSchema)
    protected readonly repository: Repository<Author>,
  ) {
    super(repository);
  }
}
