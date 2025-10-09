import BaseRepository from '@common/base/infrastructure/database/base.repository';

import { Book } from '@/module/book/domain/book.entity';

export const BOOK_REPOSITORY_KEY = 'book_repository';

export interface IBookRepository extends BaseRepository<Book> {}
