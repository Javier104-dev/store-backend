import { ProductDto } from '@module/product/application/dto/product.dto';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';

import { FilterOptions } from '@common/base/get-all-options.interface';

class StoreFilter {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  name: string;
}

class CategoriesFilter {
  @IsOptional()
  @IsUUID()
  id: string;
}

export class ProductFilterQueryParamsDto
  extends ProductDto
  implements FilterOptions<ProductDto>
{
  @IsOptional()
  @ValidateNested()
  @Type(() => StoreFilter)
  store?: StoreFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => CategoriesFilter)
  categories?: CategoriesFilter;
}
