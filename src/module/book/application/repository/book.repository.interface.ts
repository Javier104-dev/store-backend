import IRepository from '@common/base/infrastructure/database/repository.interface';

import { Book } from '@/module/book/domain/book.entity';

export const BOOK_REPOSITORY_KEY = 'book_repository';

export type IBookRepository = IRepository<Book>;
