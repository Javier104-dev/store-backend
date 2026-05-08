import { IsOptional } from 'class-validator';

import { BaseDto, DtoProperty } from '@common/base/application/dto/base.dto';

export class UploadDto extends BaseDto {
  @DtoProperty
  @IsOptional()
  key?: string;

  @DtoProperty
  @IsOptional()
  url?: string;
}
