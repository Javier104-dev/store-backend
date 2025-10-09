import { AuthorDto } from '@module/author/application/dto/author.dto';

import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

export class AuthorFieldsQueryParamsDto extends FieldsQueryParamsDto<AuthorDto> {
  target = getDtoProperties(AuthorDto) as FieldOptions<AuthorDto>;
}
