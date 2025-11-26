import { User } from '@module/iam/user/domain/user.entity';
import { IsOptional } from 'class-validator';

import { BaseDto, DtoProperty } from '@common/base/application/dto/base.dto';

export class StoreDto extends BaseDto {
  @DtoProperty
  @IsOptional()
  name?: string;

  @DtoProperty
  @IsOptional()
  owner?: User;
}
