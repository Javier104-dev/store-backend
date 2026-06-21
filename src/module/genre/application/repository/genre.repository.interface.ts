import IRepository from '@common/base/infrastructure/database/repository.interface';

import { Genre } from '@/module/genre/domain/genre.entity';

export const GENRE_REPOSITORY_KEY = 'genre_repository';

export type IGenreRepository = IRepository<Genre>;
