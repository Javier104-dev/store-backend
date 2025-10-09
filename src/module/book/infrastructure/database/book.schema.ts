import { Author } from '@module/author/domain/author.entity';
import { Genre } from '@module/genre/domain/genre.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

import { Book } from '@/module/book/domain/book.entity';

export const BookSchema = new EntitySchema<Book>({
  name: Book.name,
  target: Book,
  tableName: 'book',
  columns: withBaseSchemaColumns({
    name: {
      type: String,
      nullable: false,
    },
    authorId: {
      type: String,
      nullable: true,
    },
  }),
  relations: {
    author: {
      type: 'many-to-one',
      target: Author.name,
      joinColumn: {
        name: 'author_id',
      },
      nullable: true,
      onDelete: 'SET NULL',
    },
    genres: {
      type: 'many-to-many',
      target: Genre.name,
      joinTable: {
        name: 'book_genre',
        joinColumn: {
          name: 'book_id',
        },
        inverseJoinColumn: {
          name: 'genre_id',
        },
      },
      inverseSide: 'books',
    },
  },
});
