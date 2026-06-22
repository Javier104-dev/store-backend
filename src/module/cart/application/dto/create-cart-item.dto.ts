import { IsInt, IsUUID, Min } from 'class-validator';

import { DtoProperty } from '@common/base/application/dto/base.dto';

export class CreateCartItemDto {
  @DtoProperty
  @IsUUID()
  productId: string;

  @DtoProperty
  @IsInt()
  @Min(1)
  quantity: number;
}
