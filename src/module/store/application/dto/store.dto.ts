import { IsOptional } from 'class-validator';

import { BaseDto, DtoProperty } from '@common/base/application/dto/base.dto';

export class StoreDto extends BaseDto {
  @DtoProperty
  @IsOptional()
  name?: string;
}
