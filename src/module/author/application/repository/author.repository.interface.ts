import BaseRepository from '@common/base/infrastructure/database/base.repository';

import { Author } from '@/module/author/domain/author.entity';

export const AUTHOR_REPOSITORY_KEY = 'author_repository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAuthorRepository extends BaseRepository<Author> {}
