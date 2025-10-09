import { AppRole } from '@module/iam/authorization/domain/app-role.enum';
import { IsOptional } from 'class-validator';

import { BaseDto, DtoProperty } from '@common/base/application/dto/base.dto';

export class UserDto extends BaseDto {
  @DtoProperty
  id: string;

  @DtoProperty
  @IsOptional()
  username?: string;

  @DtoProperty
  @IsOptional()
  externalId?: string;

  @DtoProperty
  @IsOptional()
  roles?: AppRole[];

  @DtoProperty
  @IsOptional()
  createdAt?: string;

  @DtoProperty
  @IsOptional()
  updatedAt?: string;

  @DtoProperty
  @IsOptional()
  isVerified: boolean;

  @DtoProperty
  @IsOptional()
  deletedAt?: string;
}
