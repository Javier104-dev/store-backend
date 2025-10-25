import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

import { ProductDto } from '../product.dto';

export class ProductFieldsQueryParamsDto extends FieldsQueryParamsDto<ProductDto> {
  target = getDtoProperties(ProductDto) as FieldOptions<ProductDto>;
}
