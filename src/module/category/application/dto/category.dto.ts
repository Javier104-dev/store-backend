import { IsOptional } from 'class-validator';

import { BaseDto, DtoProperty } from '@common/base/application/dto/base.dto';

export class CategoryDto extends BaseDto {
  @DtoProperty
  @IsOptional()
  name?: string;
}
