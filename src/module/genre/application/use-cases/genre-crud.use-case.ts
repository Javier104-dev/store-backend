import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';

import { CreateGenreDto } from '@/module/genre/application/dto/create-genre.dto';
import { GenreDto } from '@/module/genre/application/dto/genre.dto';
import { UpdateGenreDto } from '@/module/genre/application/dto/update-genre.dto';
import {
  GENRE_REPOSITORY_KEY,
  IGenreRepository,
} from '@/module/genre/application/repository/genre.repository.interface';
import { Genre } from '@/module/genre/domain/genre.entity';

@Injectable()
export class GenreCrudUseCase extends BaseCrudUseCase<
  Genre,
  GenreDto,
  CreateGenreDto,
  UpdateGenreDto
> {
  constructor(
    @Inject(GENRE_REPOSITORY_KEY)
    repository: IGenreRepository,
    mapper: DtoMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, mapper, responseAdapter, Genre.getEntityName());
  }
}
