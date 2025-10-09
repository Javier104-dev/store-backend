import { GenreDto } from '@module/genre/application/dto/genre.dto';

import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

export class GenreFieldsQueryParamsDto extends FieldsQueryParamsDto<GenreDto> {
  target = getDtoProperties(GenreDto) as FieldOptions<GenreDto>;
}
