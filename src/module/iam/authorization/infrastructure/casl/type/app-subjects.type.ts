import { InferSubjects } from '@casl/ability';
import { Author } from '@module/author/domain/author.entity';
import { Book } from '@module/book/domain/book.entity';
import { Genre } from '@module/genre/domain/genre.entity';
import { User } from '@module/iam/user/domain/user.entity';

export type AppSubjects =
  | InferSubjects<
      | typeof User
      | User
      | typeof Book
      | Book
      | typeof Author
      | Author
      | typeof Genre
      | Genre
    >
  | 'all';
