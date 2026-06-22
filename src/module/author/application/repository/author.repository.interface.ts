import IRepository from '@common/base/infrastructure/database/repository.interface';

import { Author } from '@/module/author/domain/author.entity';

export const AUTHOR_REPOSITORY_KEY = 'author_repository';

export type IAuthorRepository = IRepository<Author>;
