import { Author } from '@module/author/domain/author.entity';
import { Genre } from '@module/genre/domain/genre.entity';

import { Base } from '@common/base/domain/base.entity';

export class Book extends Base {
  name!: string;

  authorId?: string;

  author?: Author;

  genres!: Genre[];
}
