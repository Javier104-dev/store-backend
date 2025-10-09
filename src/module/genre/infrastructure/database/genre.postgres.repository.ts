import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

import { Genre } from '@/module/genre/domain/genre.entity';
import { GenreSchema } from '@/module/genre/infrastructure/database/genre.schema';

@Injectable()
export class GenrePostgresRepository extends BaseRepository<Genre> {
  constructor(
    @InjectRepository(GenreSchema)
    protected readonly repository: Repository<Genre>,
  ) {
    super(repository);
  }
}
