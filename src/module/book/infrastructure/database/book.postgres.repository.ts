import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

import { Book } from '@/module/book/domain/book.entity';
import { BookSchema } from '@/module/book/infrastructure/database/book.schema';

@Injectable()
export class BookPostgresRepository extends BaseRepository<Book> {
  constructor(
    @InjectRepository(BookSchema)
    protected readonly repository: Repository<Book>,
  ) {
    super(repository);
  }
}
