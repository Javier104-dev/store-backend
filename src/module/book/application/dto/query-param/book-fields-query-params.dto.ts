import { BookDto } from '@module/book/application/dto/book.dto';

import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

export class BookFieldsQueryParamsDto extends FieldsQueryParamsDto<BookDto> {
  target = getDtoProperties(BookDto) as FieldOptions<BookDto>;
}
