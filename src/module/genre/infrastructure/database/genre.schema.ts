import { Book } from '@module/book/domain/book.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

import { Genre } from '@/module/genre/domain/genre.entity';

export const GenreSchema = new EntitySchema<Genre>({
  name: Genre.name,
  target: Genre,
  tableName: 'genre',
  columns: withBaseSchemaColumns({
    name: {
      type: String,
    },
  }),
  relations: {
    books: {
      type: 'many-to-many',
      target: Book.name,
      inverseSide: 'genres',
    },
  },
});
