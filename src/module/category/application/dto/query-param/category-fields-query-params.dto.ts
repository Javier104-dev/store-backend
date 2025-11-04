import { CategoryDto } from '@module/category/application/dto/category.dto';

import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

export class CategoryFieldsQueryParamsDto extends FieldsQueryParamsDto<CategoryDto> {
  target = getDtoProperties(CategoryDto) as FieldOptions<CategoryDto>;
}
