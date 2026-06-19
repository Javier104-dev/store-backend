import { ProductDto } from '@module/product/application/dto/product.dto';
import { IsOptional } from 'class-validator';

import { BaseDto, DtoProperty } from '@common/base/application/dto/base.dto';

export class CartItemDto extends BaseDto {
  @DtoProperty
  @IsOptional()
  quantity: number;

  @DtoProperty
  @IsOptional()
  unitPrice: string;

  @DtoProperty
  @IsOptional()
  product: ProductDto;
}
