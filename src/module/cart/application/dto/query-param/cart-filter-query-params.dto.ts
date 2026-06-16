import { CartDto } from '@module/cart/application/dto/cart.dto';

import { FilterOptions } from '@common/base/get-all-options.interface';

export class CartFilterQueryParamsDto
  extends CartDto
  implements FilterOptions<CartDto> {}
