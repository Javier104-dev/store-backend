import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { FilterOptions } from '@common/base/get-all-options.interface';

import { ProductDto } from '../product.dto';

class UserFilter {
  @IsOptional()
  username?: string;
}

export class ProductFilterQueryParamsDto
  extends ProductDto
  implements FilterOptions<ProductDto>
{
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFilter)
  user?: UserFilter;
}
