import { IsInt, Min } from 'class-validator';

import { DtoProperty } from '@common/base/application/dto/base.dto';

export class UpdateCartItemDto {
  @DtoProperty
  @IsInt()
  @Min(1)
  quantity: number;
}
