import BaseRepository from '@common/base/infrastructure/database/base.repository';

import { Genre } from '@/module/genre/domain/genre.entity';

export const GENRE_REPOSITORY_KEY = 'genre_repository';

export interface IGenreRepository extends BaseRepository<Genre> {}
