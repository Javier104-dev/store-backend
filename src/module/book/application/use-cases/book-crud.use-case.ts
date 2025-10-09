import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';

import { BookDto } from '@/module/book/application/dto/book.dto';
import { CreateBookDto } from '@/module/book/application/dto/create-book.dto';
import { UpdateBookDto } from '@/module/book/application/dto/update-book.dto';
import {
  BOOK_REPOSITORY_KEY,
  IBookRepository,
} from '@/module/book/application/repository/book.repository.interface';
import { Book } from '@/module/book/domain/book.entity';

@Injectable()
export class BookCrudUseCase extends BaseCrudUseCase<
  Book,
  BookDto,
  CreateBookDto,
  UpdateBookDto
> {
  constructor(
    @Inject(BOOK_REPOSITORY_KEY)
    repository: IBookRepository,
    mapper: DtoMapper,
    responseAdapter: BaseResponseAdapter,
  ) {
    super(repository, mapper, responseAdapter, Book.getEntityName());
  }
}
