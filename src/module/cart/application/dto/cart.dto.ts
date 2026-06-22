import { CartItemDto } from '@module/cart/application/dto/cart-item.dto';
import { CART_STATUS, CartStatus } from '@module/cart/domain/cart-status';
import { UserDto } from '@module/iam/user/application/dto/user.dto';
import { IsIn, IsOptional } from 'class-validator';

import { BaseDto, DtoProperty } from '@common/base/application/dto/base.dto';

export class CartDto extends BaseDto {
  @DtoProperty
  @IsOptional()
  @IsIn(Object.values(CART_STATUS))
  status?: CartStatus;

  @DtoProperty
  @IsOptional()
  user?: UserDto;

  @DtoProperty
  @IsOptional()
  items?: CartItemDto[];
}
