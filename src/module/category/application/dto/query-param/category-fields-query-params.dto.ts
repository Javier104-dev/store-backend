import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

import { CategoryDto } from '../category.dto';

export class CategoryFieldsQueryParamsDto extends FieldsQueryParamsDto<CategoryDto> {
  target = getDtoProperties(CategoryDto) as FieldOptions<CategoryDto>;
}
