import { ProductDto } from '@module/product/application/dto/product.dto';

import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

export class ProductFieldsQueryParamsDto extends FieldsQueryParamsDto<ProductDto> {
  target = getDtoProperties(ProductDto) as FieldOptions<ProductDto>;
}
