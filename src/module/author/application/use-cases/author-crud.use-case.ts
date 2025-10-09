import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';

import { AuthorDto } from '@/module/author/application/dto/author.dto';
import { CreateAuthorDto } from '@/module/author/application/dto/create-author.dto';
import { UpdateAuthorDto } from '@/module/author/application/dto/update-author.dto';
import {
  AUTHOR_REPOSITORY_KEY,
  IAuthorRepository,
} from '@/module/author/application/repository/author.repository.interface';
import { Author } from '@/module/author/domain/author.entity';

@Injectable()
export class AuthorCrudUseCase extends BaseCrudUseCase<
  Author,
  AuthorDto,
  CreateAuthorDto,
  UpdateAuthorDto
> {
  constructor(
    @Inject(AUTHOR_REPOSITORY_KEY)
    repository: IAuthorRepository,
    mapper: DtoMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, mapper, responseAdapter, Author.getEntityName());
  }
}
