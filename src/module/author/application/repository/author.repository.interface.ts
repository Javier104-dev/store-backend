import BaseRepository from '@common/base/infrastructure/database/base.repository';

import { Author } from '@/module/author/domain/author.entity';

export const AUTHOR_REPOSITORY_KEY = 'author_repository';

export interface IAuthorRepository extends BaseRepository<Author> {}
