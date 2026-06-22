import { CartDto } from '@module/cart/application/dto/cart.dto';

import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

export class CartFieldsQueryParamsDto extends FieldsQueryParamsDto<CartDto> {
  target = getDtoProperties(CartDto) as FieldOptions<CartDto>;
}
