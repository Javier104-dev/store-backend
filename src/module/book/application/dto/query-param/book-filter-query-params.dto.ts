import { BookDto } from '@module/book/application/dto/book.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { FilterOptions } from '@common/base/get-all-options.interface';

class AuthorFilter {
  @IsOptional()
  name?: string;
}

export class BookFilterQueryParamsDto
  extends BookDto
  implements FilterOptions<BookDto>
{
  @IsOptional()
  @ValidateNested()
  @Type(() => AuthorFilter)
  author?: AuthorFilter;
}
