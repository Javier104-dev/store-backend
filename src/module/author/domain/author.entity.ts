import { Book } from '@module/book/domain/book.entity';

import { Base } from '@common/base/domain/base.entity';

export class Author extends Base {
  name!: string;

  books!: Book[];
}
