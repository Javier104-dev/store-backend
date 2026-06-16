import { CART_STATUS, CartStatus } from '@module/cart/domain/cart-status';
import { IsIn, IsOptional } from 'class-validator';

import { BaseDto, DtoProperty } from '@common/base/application/dto/base.dto';

export class CartDto extends BaseDto {
  @DtoProperty
  @IsOptional()
  @IsIn(Object.values(CART_STATUS))
  status?: CartStatus;
}
