import { Book } from '@module/book/domain/book.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

import { Author } from '@/module/author/domain/author.entity';

export const AuthorSchema = new EntitySchema<Author>({
  name: Author.name,
  target: Author,
  tableName: 'author',
  columns: withBaseSchemaColumns({
    name: {
      type: String,
      nullable: false,
    },
  }),
  relations: {
    books: {
      type: 'one-to-many',
      target: Book.name,
      cascade: true,
      inverseSide: 'author',
    },
  },
});
